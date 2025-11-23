from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_new_templates(page: Page):
    # 1. Navigate to the app
    page.goto("http://localhost:5173")

    # Wait for the app to load
    expect(page.get_by_role("heading", name="InstaFlow", exact=True)).to_be_visible()

    # 2. Select "Modern Gradient" Theme
    # Find the select element for theme (it has the current value as text)
    # We can select by label or find the select element directly
    # The select element contains options like "Tech Dark", "Biz Clean", etc.

    # Select "Modern Gradient (Best)"
    page.select_option("select:has-text('Tech Dark')", label="Modern Gradient (Best)")

    # Wait for rendering
    time.sleep(1)

    # Take screenshot
    page.screenshot(path="verification/templates/modern_gradient.png")
    print("Captured Modern Gradient theme")

    # 3. Select "Emotional Film" Theme
    page.select_option("select:has-text('Modern Gradient')", label="Emotional Film (New)")

    # Wait for rendering
    time.sleep(1)

    # Take screenshot
    page.screenshot(path="verification/templates/emotional_film.png")
    print("Captured Emotional Film theme")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_new_templates(page)
            print("Template verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/templates/failure.png")
            exit(1)
        finally:
            browser.close()
