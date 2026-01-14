
from playwright.sync_api import sync_playwright

def verify_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify index.html (RDP Mode)
        print("Verifying index.html...")
        page.goto("http://localhost:8000/projects/relatorio-interativo/index.html")
        page.wait_for_selector("text=Modo TecnoIT")
        page.screenshot(path="verification_index.png")

        # Verify tecnoit.html (TecnoIT Mode)
        print("Verifying tecnoit.html...")
        page.goto("http://localhost:8000/projects/relatorio-interativo/tecnoit.html")
        page.wait_for_selector("text=Modo RDP")
        # Ensure logo exists
        page.wait_for_selector("img[alt='Logo TecnoIT']")
        page.screenshot(path="verification_tecnoit.png")

        browser.close()

if __name__ == "__main__":
    verify_pages()
