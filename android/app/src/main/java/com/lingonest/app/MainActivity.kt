package com.lingonest.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.view.Gravity
import android.view.HapticFeedbackConstants
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : ComponentActivity() {

    private lateinit var rootView: FrameLayout
    private lateinit var webView: WebView
    private lateinit var splashOverlay: LinearLayout
    private lateinit var offlineOverlay: LinearLayout

    private var pendingWebPermission: PermissionRequest? = null
    private var pendingSpeechLang: String? = null
    private var speechRecognizer: SpeechRecognizer? = null

    private val micPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        val webReq = pendingWebPermission
        pendingWebPermission = null
        if (webReq != null) {
            if (granted) webReq.grant(webReq.resources) else webReq.deny()
        }

        val lang = pendingSpeechLang
        pendingSpeechLang = null
        if (lang != null) {
            if (granted) {
                launchNativeSpeechRecognizer(lang)
            } else {
                notifyJsSpeechError("not-allowed")
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        applyNativeBars("mini")

        rootView = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#EEF8FF"))
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
        }

        webView = WebView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
            setBackgroundColor(Color.parseColor("#EEF8FF"))
            overScrollMode = View.OVER_SCROLL_NEVER
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
        }

        splashOverlay = buildSplashOverlay()
        offlineOverlay = buildOfflineOverlay()
        offlineOverlay.visibility = View.GONE

        rootView.addView(webView)
        rootView.addView(splashOverlay)
        rootView.addView(offlineOverlay)
        setContentView(rootView)

        configureWebView()
        loadLingoNest()

        // Native Back button cooperates with LingoNest in-app navigation (closes modals/lessons cleanly!)
        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    webView.evaluateJavascript(
                        "(function(){return typeof window.__lingonestGoBack==='function' ? !!window.__lingonestGoBack() : false;})()",
                    ) { result ->
                        if (result == "true") {
                            return@evaluateJavascript
                        }
                        if (webView.canGoBack()) {
                            webView.goBack()
                        } else {
                            isEnabled = false
                            onBackPressedDispatcher.onBackPressed()
                        }
                    }
                }
            },
        )
    }

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    private fun configureWebView() {
        val s = webView.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true
        s.databaseEnabled = true
        s.mediaPlaybackRequiresUserGesture = false
        s.allowFileAccess = false
        s.allowContentAccess = true
        s.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        s.builtInZoomControls = false
        s.displayZoomControls = false
        s.useWideViewPort = true
        s.loadWithOverviewMode = true
        s.textZoom = 100
        s.cacheMode = if (isOnline()) WebSettings.LOAD_DEFAULT else WebSettings.LOAD_CACHE_ELSE_NETWORK

        webView.addJavascriptInterface(LingoAndroidBridge(), "AndroidBridge")

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread {
                    val wantsAudio = request.resources.any {
                        it == PermissionRequest.RESOURCE_AUDIO_CAPTURE
                    }
                    if (!wantsAudio) {
                        request.deny()
                        return@runOnUiThread
                    }
                    val hasMic = ContextCompat.checkSelfPermission(
                        this@MainActivity,
                        Manifest.permission.RECORD_AUDIO,
                    ) == PackageManager.PERMISSION_GRANTED
                    if (hasMic) {
                        request.grant(request.resources)
                    } else {
                        pendingWebPermission?.deny()
                        pendingWebPermission = request
                        micPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                    }
                }
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url.toString()
                if (url.startsWith(LIVE_ORIGIN)) {
                    return false
                }
                runCatching {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                }
                return true
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                if (offlineOverlay.visibility != View.VISIBLE) {
                    splashOverlay.animate()
                        .alpha(0f)
                        .setDuration(240)
                        .withEndAction { splashOverlay.visibility = View.GONE }
                        .start()
                }
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError,
            ) {
                super.onReceivedError(view, request, error)
                if (request.isForMainFrame) {
                    splashOverlay.visibility = View.GONE
                    offlineOverlay.visibility = View.VISIBLE
                }
            }
        }
    }

    private fun applyNativeBars(mode: String) {
        val (statusHex, navHex, lightIcons) = when (mode) {
            "master" -> Triple("#090E1A", "#0B1120", false)
            "explorer" -> Triple("#EEF2FF", "#FFFFFF", true)
            else -> Triple("#EEF8FF", "#FFFDF6", true)
        }
        val statusColor = Color.parseColor(statusHex)
        val navColor = Color.parseColor(navHex)
        @Suppress("DEPRECATION")
        window.statusBarColor = statusColor
        @Suppress("DEPRECATION")
        window.navigationBarColor = navColor
        val insets = WindowCompat.getInsetsController(window, window.decorView)
        insets.isAppearanceLightStatusBars = lightIcons
        insets.isAppearanceLightNavigationBars = lightIcons
        if (::rootView.isInitialized) rootView.setBackgroundColor(statusColor)
        if (::webView.isInitialized) webView.setBackgroundColor(statusColor)
    }

    private fun performNativeHaptic(kind: String) {
        if (!::webView.isInitialized) return
        when (kind) {
            "tap" -> webView.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
            "success", "celebrate", "unlock" -> {
                vibrateShort(if (kind == "celebrate") 38L else 22L)
            }
            "gentle-nudge" -> vibrateShort(14L)
        }
    }

    private fun vibrateShort(ms: Long) {
        runCatching {
            val vib = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                (getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager)?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }
            if (vib != null && vib.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vib.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    vib.vibrate(ms)
                }
            }
        }
    }

    private fun launchNativeSpeechRecognizer(bcp47: String) {
        stopNativeSpeechInternal()
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            notifyJsSpeechError("unsupported")
            return
        }
        val sr = SpeechRecognizer.createSpeechRecognizer(this)
        speechRecognizer = sr
        sr.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {}
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {}
            override fun onPartialResults(partialResults: Bundle?) {}
            override fun onEvent(eventType: Int, params: Bundle?) {}

            override fun onError(error: Int) {
                val reason = when (error) {
                    SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "no-speech"
                    SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "not-allowed"
                    SpeechRecognizer.ERROR_NETWORK, SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "network"
                    else -> "mic-error"
                }
                notifyJsSpeechError(reason)
            }

            override fun onResults(results: Bundle?) {
                val list = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION).orEmpty()
                val arr = JSONArray()
                for (item in list) arr.put(item)
                val escaped = JSONObject.quote(arr.toString())
                runOnUiThread {
                    webView.evaluateJavascript(
                        "window.__onNativeSpeechResult && window.__onNativeSpeechResult($escaped);",
                        null,
                    )
                }
            }
        })

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, bcp47)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, bcp47)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false)
        }
        runCatching { sr.startListening(intent) }.onFailure {
            notifyJsSpeechError("start-failed")
        }
    }

    private fun stopNativeSpeechInternal() {
        speechRecognizer?.let { sr ->
            runCatching { sr.cancel() }
            runCatching { sr.destroy() }
        }
        speechRecognizer = null
    }

    private fun notifyJsSpeechError(reason: String) {
        val safe = reason.replace("'", "")
        runOnUiThread {
            webView.evaluateJavascript(
                "window.__onNativeSpeechError && window.__onNativeSpeechError('$safe');",
                null,
            )
        }
    }

    private inner class LingoAndroidBridge {
        @JavascriptInterface
        fun setThemeMode(mode: String) {
            runOnUiThread { applyNativeBars(mode) }
        }

        @JavascriptInterface
        fun haptic(kind: String) {
            runOnUiThread { performNativeHaptic(kind) }
        }

        @JavascriptInterface
        fun startNativeSpeech(bcp47: String) {
            runOnUiThread {
                val hasMic = ContextCompat.checkSelfPermission(
                    this@MainActivity,
                    Manifest.permission.RECORD_AUDIO,
                ) == PackageManager.PERMISSION_GRANTED
                if (hasMic) {
                    launchNativeSpeechRecognizer(bcp47)
                } else {
                    pendingSpeechLang = bcp47
                    micPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                }
            }
        }

        @JavascriptInterface
        fun stopNativeSpeech() {
            runOnUiThread { stopNativeSpeechInternal() }
        }
    }

    private fun loadLingoNest() {
        offlineOverlay.visibility = View.GONE
        splashOverlay.alpha = 1f
        splashOverlay.visibility = View.VISIBLE
        webView.settings.cacheMode =
            if (isOnline()) WebSettings.LOAD_DEFAULT else WebSettings.LOAD_CACHE_ELSE_NETWORK
        webView.loadUrl(LIVE_URL)
    }

    private fun isOnline(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return true
        val net = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(net) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun buildSplashOverlay(): LinearLayout {
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#0F172A"))
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
            setPadding(48, 48, 48, 48)
        }
        val icon = TextView(this).apply {
            text = "🦉"
            textSize = 68f
            gravity = Gravity.CENTER
        }
        val title = TextView(this).apply {
            text = "LingoNest"
            textSize = 30f
            setTypeface(null, Typeface.BOLD)
            setTextColor(Color.parseColor("#F8FAFC"))
            gravity = Gravity.CENTER
            setPadding(0, 16, 0, 8)
        }
        val sub = TextView(this).apply {
            text = "Doğal Dil Dünyası • 1.912 Stüdyo Nöral Ses"
            textSize = 14f
            setTextColor(Color.parseColor("#38BDF8"))
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 28)
        }
        val spinner = ProgressBar(this)
        box.addView(icon)
        box.addView(title)
        box.addView(sub)
        box.addView(spinner)
        return box
    }

    private fun buildOfflineOverlay(): LinearLayout {
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#0F172A"))
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
            setPadding(64, 64, 64, 64)
        }
        val title = TextView(this).apply {
            text = "📡 İnternet Bağlantısı Bekleniyor"
            textSize = 20f
            setTypeface(null, Typeface.BOLD)
            setTextColor(Color.parseColor("#F8FAFC"))
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 14)
        }
        val desc = TextView(this).apply {
            text = "LingoNest ilk açılışta canlı ses paketini yükler. Bağlantınızı kontrol edip tekrar deneyin."
            textSize = 14f
            setTextColor(Color.parseColor("#94A3B8"))
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 28)
        }
        val retryBtn = Button(this).apply {
            text = "Tekrar Dene"
            setTextColor(Color.parseColor("#0F172A"))
            setBackgroundColor(Color.parseColor("#38BDF8"))
            setPadding(48, 24, 48, 24)
            setOnClickListener { loadLingoNest() }
        }
        box.addView(title)
        box.addView(desc)
        box.addView(retryBtn)
        return box
    }

    override fun onPause() {
        super.onPause()
        stopNativeSpeechInternal()
        webView.onPause()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onDestroy() {
        stopNativeSpeechInternal()
        pendingWebPermission?.deny()
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        private const val LIVE_ORIGIN = "https://imza464-cmyk.github.io/LingoNest"
        private const val LIVE_URL = "$LIVE_ORIGIN/"
    }
}
