---
description: Scan all UI copy for banned language and copy rule violations
---

## Copy compliance scan

Scan every .jsx, .js, and .css file for banned words and copy violations.

### Step 1: Scan for banned words

!`grep -rn --include="*.jsx" --include="*.js" -i "spiritual guidance\|your journey\|cosmic\|unlock\|universe is telling\|the stars say\|dangerous period\|you must act\|transformative\|holistic\|leverage\|empower\|algorithm\|based on your inputs\|match:[[:space:]]*[0-9]" frontend/src/ 2>/dev/null || echo "No banned words found"`

### Step 2: Check for score/percentage displays on practitioners

!`grep -rn --include="*.jsx" "match\|score\|percent\|87\|92\|95" frontend/src/components/PractitionerCard.jsx frontend/src/components/PractitionerListing.jsx 2>/dev/null | grep -v "//\|import\|className" || echo "No percentage matches found in practitioner components"`

### Step 3: Check CTA button copy

!`grep -rn --include="*.jsx" -i "book now\|schedule\|begin\|get started\|learn more\|view profile\|submit\|maybe later" frontend/src/components/ 2>/dev/null || echo "No CTA violations found"`

### Step 4: Check error state copy

!`grep -rn --include="*.jsx" -i "error 5\|something went wrong\|nothing here yet\|no results found" frontend/src/ 2>/dev/null || echo "No error copy violations found"`

### Step 5: Check Mira placeholder text

!`grep -rn --include="*.jsx" "Tell Mira\|placeholder" frontend/src/components/MiraBar.jsx frontend/src/components/MiraScreen.jsx 2>/dev/null | head -10`

Verify the placeholder is exactly: `Tell Mira what's going on…` (with ellipsis, not "...")

### Step 6: Check phone gate copy

!`grep -rn --include="*.jsx" -i "continue\|skip\|submit\|next\|OTP\|verify" frontend/src/components/PhoneGate.jsx 2>/dev/null | head -20`

Verify:
- CTA is "Continue →" not "Submit" or "Next"
- Skip is "Skip for now" not "Skip this step"
- OTP screen has "Resend code" not "Resend OTP" or "Didn't receive code?"

### Summary

List every violation found with:
- File name and line number
- Current copy
- Required replacement (from .claude/rules/copy-rules.md)

If no violations found, confirm "Copy compliance: PASSED".
