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
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
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

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private lateinit var splashOverlay: LinearLayout
    private lateinit var offlineOverlay: LinearLayout
    private var pendingWebPermission: PermissionRequest? = null

    private val micPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        val req = pendingWebPermission
        pendingWebPermission = null
        if (req != null) {
            if (granted) {
                req.grant(req.resources)
            } else {
                req.deny()
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        val root = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#0F172A"))
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
            setBackgroundColor(Color.parseColor("#0F172A"))
            overScrollMode = View.OVER_SCROLL_NEVER
        }

        splashOverlay = buildSplashOverlay()
        offlineOverlay = buildOfflineOverlay()
        offlineOverlay.visibility = View.GONE

        root.addView(webView)
        root.addView(splashOverlay)
        root.addView(offlineOverlay)
        setContentView(root)

        configureWebView()
        loadLingoNest()

        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    }
                }
            },
        )
    }

    @SuppressLint("SetJavaScriptEnabled")
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
        s.cacheMode = if (isOnline()) WebSettings.LOAD_DEFAULT else WebSettings.LOAD_CACHE_ELSE_NETWORK

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
                        .setDuration(260)
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
        webView.onPause()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onDestroy() {
        pendingWebPermission?.deny()
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        private const val LIVE_ORIGIN = "https://imza464-cmyk.github.io/LingoNest"
        private const val LIVE_URL = "$LIVE_ORIGIN/"
    }
}
