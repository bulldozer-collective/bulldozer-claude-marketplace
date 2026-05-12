---
name: Create Company
description: Explains how to create a new Company.
allowed-tools:
- mcp__plugin_bulldozer_bulldozer__createCompany
- mcp__plugin_bulldozer_bulldozer__getCompany
- mcp__plugin_bulldozer_bulldozer__listCompanies
---

# Process

## Check for duplicate
When creating a company, first check if a Company with a similar name exists by using mcp__plugin_bulldozer_bulldozer__listCompanies.
If a company has a name close to the one provided by the user, show him the similar names and ask the user if we shall continue the company creation.

## Ask user for data
Ask the user to get the following data sequentially:
- company website
- if the company shall be enriched
- optional tags
- optional description
- optional address

## Create the company
Use mcp__plugin_bulldozer_bulldozer__createCompany tool with the provided data.

