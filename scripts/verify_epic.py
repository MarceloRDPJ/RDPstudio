import asyncio
from playwright.async_api import async_playwright
import os
import sys

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Use localhost to avoid CORS issues with fetch()
        url = "http://localhost:8000/projects/scanner-game-free/index.html"

        print(f"Navigating to {url}")
        try:
            await page.goto(url)
        except Exception as e:
            print(f"Failed to navigate: {e}")
            await browser.close()
            return

        # Wait for React to hydrate and fetch data
        await page.wait_for_timeout(3000)

        print("Clicking 'Epic Dashboard' filter button...")
        try:
            # Finding the button by text content
            await page.get_by_role("button", name="Epic Dashboard").click()
        except Exception as e:
            print(f"Could not find or click button: {e}")
            await page.screenshot(path="debug_click_fail.png")
            await browser.close()
            return

        await page.wait_for_timeout(2000)

        print("--- VERIFYING EPIC DASHBOARD SECTIONS ---")

        # 1. Mystery Game Header
        if await page.get_by_role("heading", name="JOGO MISTERIOSO").is_visible():
            print("SUCCESS: 'JOGO MISTERIOSO' section found.")
        else:
            print("FAILURE: 'JOGO MISTERIOSO' section NOT found.")

        # 2. Daily Game (Ghostrunner 2)
        if await page.get_by_role("heading", name="Ghostrunner 2").is_visible():
            print("SUCCESS: 'Ghostrunner 2' found.")
        else:
            print("FAILURE: 'Ghostrunner 2' NOT found.")

        # 3. New Intelligence Section
        if await page.get_by_text("Inteligência Interceptada").is_visible():
            print("SUCCESS: 'Inteligência Interceptada' section found.")
        else:
            print("FAILURE: 'Inteligência Interceptada' section NOT found.")

        # 4. Mock Data Verification (Ubisoft / Epic Leak)
        if await page.get_by_text("Ubisoft").is_visible():
             print("SUCCESS: Mock Leak 'Ubisoft' found.")
        else:
             print("FAILURE: Mock Leak 'Ubisoft' NOT found.")

        # 5. Enhanced API Logs
        if await page.get_by_text("SECURITY_LOG_V2.1").is_visible():
            print("SUCCESS: Enhanced Security Log found.")
        else:
            print("FAILURE: Enhanced Security Log NOT found.")

        await page.screenshot(path="epic_dashboard_final_v2.png", full_page=True)
        print("Screenshot saved to epic_dashboard_final_v2.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
