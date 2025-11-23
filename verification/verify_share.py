from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_share_feature(page: Page):
    # 1. Navigate to the app
    # Assuming the dev server is running on localhost:5173
    page.goto("http://localhost:5173")

    # Wait for the app to load (e.g., header text)
    # Use a more specific selector to avoid strict mode violation
    expect(page.get_by_role("heading", name="InstaFlow", exact=True)).to_be_visible()

    # 2. Verify Share Button Exists
    share_button = page.get_by_role("button", name="공유")
    expect(share_button).to_be_visible()

    # 3. Click Share Button and Verify Menu
    share_button.click()

    # Check for Twitter option
    twitter_option = page.get_by_role("button", name="트위터 공유")
    expect(twitter_option).to_be_visible()

    # Check for Facebook option
    facebook_option = page.get_by_role("button", name="페이스북 공유")
    expect(facebook_option).to_be_visible()

    # Check for Copy Link option
    copy_option = page.get_by_role("button", name="링크 복사")
    expect(copy_option).to_be_visible()

    # 4. Take Screenshot
    page.screenshot(path="verification/share_feature_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_share_feature(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/share_feature_failure.png")
            exit(1)
        finally:
            browser.close()
