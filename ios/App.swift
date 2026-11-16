import UIKit
import WebKit

// Bundled HTML runs entirely offline; WebKit persists localStorage between launches.
@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = GameController()
        window.makeKeyAndVisible()
        self.window = window
        return true
    }
}

final class GameController: UIViewController {
    override func loadView() {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.userContentController.add(HapticsHandler(), name: "haptics")
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 17/255, green: 24/255, blue: 39/255, alpha: 1)
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        view = webView
        guard let url = Bundle.main.url(forResource: "index", withExtension: "html") else { fatalError("Missing bundled game") }
        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }
    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
}

// Safari has no navigator.vibrate; the bundled app supplies native feedback.
final class HapticsHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "haptics", let kind = message.body as? String else { return }
        let feedback = UINotificationFeedbackGenerator()
        feedback.notificationOccurred(kind == "error" ? .error : .success)
    }
}
