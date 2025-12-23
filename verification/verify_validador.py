from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local server
        page.goto("http://localhost:8000/projects/validador-firewall/index.html")

        # Verify title
        if "Validador" in page.title():
            print("Title Verified")

        # Verify external CSS loaded (by checking background color or specific class application)
        # We can check if the 'glass-card' class has the correct backdrop-filter computed style
        # But visual check is better.

        # Verify Image Loading (Logo)
        logo = page.locator("img[alt='Logo']")
        if logo.is_visible():
            print("Logo Verified")

        # Verify Layout
        page.screenshot(path="verification/validador_final.png", full_page=True)
        print("Screenshot saved to verification/validador_final.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
