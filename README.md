# Setvi Frontend Task

This is a [Vite](https://vitejs.dev/) project using **TypeScript**. Follow the steps below to get your development environment up and running.

## Setup instruction

1. Place the provided `.env` file in the root of the project.
2. Install dependencies and start the server:

   ```bash
   npm install

   npm run dev
   ```

## Explanation of AI integration

1. **AI integration is implemented using a POST call**, not the official OpenAI SDK/library.
2. **AI response calls are mocked** for development and testing purposes.
3. **"Generate Report"** is available under the **Create** page, while  
   **"Summarize Report"** is available under the **Edit** page.

## Known limitations and assumptions

1. **All API responses are mocked** — No real backend or OpenAI API calls are made by default.
2. **React Simple WYSIWYG Editor** is used for simplicity, rather than a more advanced or customizable editor.
3. **Single mock response** for each "draft" and "summarize" AI actions.  
   - If you provide a working `API_KEY` and **comment out the final mock handler**, the app should work with actual OpenAI responses.
4. **Report filtering is performed in local state**, not via a mocked API endpoint.
5. **Styling is minimal** and kept intentionally simple to focus on core functionality.
6. **Reports are saved as HTML-formatted strings**, assuming downstream systems can parse/render HTML content.
7. **Roles are implemented through store field**, there is no mocked API response that is getting the role just a field in the store that needs to be changed for different access, default role is Admin.
8. **Field validations are provisional**, they are only there to show basic functionality.

````
