import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class App extends StatefulWidget {
  final String url;

  const App({super.key, required this.url});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  WebViewController? _controller;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {},
          onPageStarted: (String url) {},
          onPageFinished: (String url) {},
          onHttpError: (HttpResponseError error) {},
          onWebResourceError: (WebResourceError error) {},
          onNavigationRequest: (NavigationRequest request) {
            if (request.url.startsWith('https://radio.dxdns.dev/')) {
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse('https://radio.dxdns.dev'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Radio 📻",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Color(0xFF151515),
      ),
      body: WebViewWidget(controller: _controller!),
    );
  }
}
