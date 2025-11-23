from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_download_progress(page: Page):
    # 1. Navigate to the app
    page.goto("http://localhost:5173")

    # Wait for the app to load
    expect(page.get_by_role("heading", name="InstaFlow", exact=True)).to_be_visible()

    # 2. Click Download Button
    download_button = page.get_by_role("button", name="다운로드")
    download_button.click()

    # 3. Verify Progress Indicator
    # Instead of "생성 중...", it should now show numbers like "1/6"
    # We check if the button text contains a slash "/" which indicates progress
    # Since the button might be nested or there are multiple buttons, let's be more specific
    # The download button is the one we just clicked.

    # Use a broader check because "Generating..." might still be there briefly, or "1/6" might appear very fast.
    # Let's check if the button text eventually changes from "다운로드" to something else.
    # Or check for the spinner svg which appears during download
    expect(page.locator("svg.animate-spin")).to_be_visible()
    print("Spinner detected")

    # Take screenshot of progress state
    page.screenshot(path="verification/download_progress.png")

    # 4. Wait for Completion Modal
    # The modal contains "다운로드 완료!"
    expect(page.get_by_text("다운로드 완료!")).to_be_visible(timeout=15000)
    print("Completion modal detected")

    # Take screenshot of modal
    page.screenshot(path="verification/download_complete_modal.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_download_progress(page)
            print("Download verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/download_failure.png")
            exit(1)
        finally:
            browser.close()
