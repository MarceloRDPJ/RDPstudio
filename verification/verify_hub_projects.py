
from playwright.sync_api import sync_playwright, expect
import os
import re

def verify_layout(page):
    # Navigate to the Hub Projects page
    page.goto("http://localhost:8000/hub/projetos.html")

    # Verify Title
    expect(page).to_have_title("RDP Studio | Projetos")

    # Verify Header
    header = page.locator("header")
    expect(header).to_be_visible()

    # Verify Active Link (Projetos should be Vibrant Cyan)
    active_link = page.locator("nav .nav-link.active")
    expect(active_link).to_have_text("Projetos")
    # Check if the class attribute contains text-vibrantCyan
    # We can use get_attribute or regex expect
    expect(active_link).to_have_class(re.compile(r"text-vibrantCyan"))

    # Verify Card Container exists
    cards = page.locator(".card-container")
    expect(cards).to_be_visible()

    # Take screenshot
    if not os.path.exists("verification"):
        os.makedirs("verification")

    page.screenshot(path="verification/hub_projects_verified.png", full_page=True)
    print("Verification complete. Screenshot saved to verification/hub_projects_verified.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 1024})
        try:
            verify_layout(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
