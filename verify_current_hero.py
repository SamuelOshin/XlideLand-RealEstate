import time
from playwright.sync_api import sync_playwright

def verify_current_hero():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop Context
        context_desktop = browser.new_context(viewport={'width': 1280, 'height': 800})
        page_desktop = context_desktop.new_page()

        try:
            page_desktop.goto("http://localhost:3003")
            # Wait for the H1 to be visible (animations fade it in)
            page_desktop.wait_for_selector('h1', state='visible', timeout=10000)
            # Wait extra time for all staggered animations to finish (0.6s duration + delays)
            time.sleep(2)
            page_desktop.screenshot(path="verification/new_hero_desktop.png")
            print("Desktop screenshot captured.")
        except Exception as e:
            print(f"Desktop verification failed: {e}")

        # Mobile Context
        context_mobile = browser.new_context(viewport={'width': 375, 'height': 667}, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')
        page_mobile = context_mobile.new_page()

        try:
            page_mobile.goto("http://localhost:3003")
            page_mobile.wait_for_selector('h1', state='visible', timeout=10000)
            time.sleep(2)
            page_mobile.screenshot(path="verification/new_hero_mobile.png")
            print("Mobile screenshot captured.")
        except Exception as e:
            print(f"Mobile verification failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_current_hero()
