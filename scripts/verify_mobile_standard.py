import asyncio
from playwright.async_api import async_playwright
import os
import sys

# Define target pages
TARGETS = [
    {
        "name": "Validador Firewall",
        "url": "http://localhost:8000/projects/validador-firewall/index.html",
        "desktop_link_selector": "header a[href='../../hub/projetos.html']",
        "mobile_btn_selector": "#mobile-menu-btn",
        "mobile_overlay_selector": "#mobile-menu-overlay",
        "mobile_link_selector": "#mobile-menu-overlay a[href='../../hub/projetos.html']"
    },
    {
        "name": "RDP Insider",
        "url": "http://localhost:8000/projects/scanner-game-free/index.html",
        "desktop_link_selector": "nav a[href='../../hub/projetos.html']",
        "mobile_btn_selector": "button[aria-label='Toggle menu']",
        "mobile_overlay_selector": ".fixed.inset-0.z-40.bg-slate-900\\/95", # React rendered class
        "mobile_link_selector": ".fixed.inset-0 a[href='../../hub/projetos.html']"
    }
]

async def verify_page(page, target):
    print(f"\n--- Verifying {target['name']} ---")

    # Navigate
    try:
        await page.goto(target['url'])
        await page.wait_for_timeout(1000) # Wait for load/hydration
    except Exception as e:
        print(f"FAILED to load {target['url']}: {e}")
        return False

    # 1. Check Desktop "Back to Hub" Link
    print("Checking Desktop 'Back to Hub' link...")
    if await page.is_visible(target['desktop_link_selector']):
        print(f"SUCCESS: Desktop link found pointing to ../../hub/projetos.html")
    else:
        print(f"FAILURE: Desktop link NOT found or incorrect selector: {target['desktop_link_selector']}")
        await page.screenshot(path=f"fail_desktop_{target['name']}.png")
        return False

    # 2. Check Footer Watermark
    print("Checking Footer Watermark...")
    if await page.locator(".watermark-container").count() > 0:
        print("SUCCESS: Watermark container exists.")
    else:
        print("FAILURE: Watermark container missing.")
        return False

    # 3. Check Mobile Menu
    print("Checking Mobile Menu...")
    # Resize to mobile
    await page.set_viewport_size({"width": 375, "height": 667})
    await page.wait_for_timeout(500)

    # Click Menu Button
    if await page.is_visible(target['mobile_btn_selector']):
        await page.click(target['mobile_btn_selector'])
        await page.wait_for_timeout(500) # Wait for animation

        # Check Overlay
        if await page.is_visible(target['mobile_overlay_selector']):
            print("SUCCESS: Mobile menu opened.")

            # Check Link in Menu
            if await page.is_visible(target['mobile_link_selector']):
                 print("SUCCESS: Mobile menu contains link to Projetos.")
            else:
                 print("FAILURE: Mobile menu missing link to Projetos.")
                 return False
        else:
            print("FAILURE: Mobile menu overlay not visible after click.")
            await page.screenshot(path=f"fail_mobile_overlay_{target['name']}.png")
            return False
    else:
        print(f"FAILURE: Mobile menu button not found: {target['mobile_btn_selector']}")
        await page.screenshot(path=f"fail_mobile_btn_{target['name']}.png")
        return False

    return True

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        success_count = 0
        for target in TARGETS:
            if await verify_page(page, target):
                success_count += 1

        await browser.close()

        if success_count == len(TARGETS):
            print("\nALL CHECKS PASSED!")
            sys.exit(0)
        else:
            print(f"\nONLY {success_count}/{len(TARGETS)} PASSED.")
            sys.exit(1)

if __name__ == "__main__":
    asyncio.run(run())
