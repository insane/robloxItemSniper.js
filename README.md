# Roblox Item Auto-Purchaser (Console Script)

This script watches one or more catalog **item IDs** and attempts to buy them automatically when they are **purchasable** and priced within your configured **min/max Robux** range. It handles CSRF token setup, reads item details, and posts a purchase request using your logged-in session.

> **⚠️ Use responsibly:** Only run on your own account and in line with Roblox’s Terms. Purchases cost Robux and are **non-reversible**.

---

## ⚡ How to Use

1. **Log in** to your Roblox account in your browser:  
   https://www.roblox.com/

2. **Open the Developer Console** on any Roblox page:  
   - Chrome / Edge: `F12` → **Console**  
   - Firefox: `Ctrl+Shift+K`  
   - Safari: `Cmd+Opt+C`

3. **Configure** the script:
   - Open `auto-purchaser.js` (or the snippet below).
   - Edit the `config` object at the top (see **Configuration** section).
   - Ensure the `items` set contains the **catalog item IDs** you want to watch.

4. **Run**: Copy the entire file contents, paste into the browser console, press **Enter**.

5. **Let it run** in the background tab. The script loops—checking items every 5 seconds—and logs actions to the console.
