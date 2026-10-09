# Fate Accelerated - Generic Character Picker

A mobile-first, static web app for players to select their characters for any Fate Accelerated campaign.

## How to Edit Campaign & Characters
All campaign details, characters, and NPCs are stored in `data.js`. 
Open `data.js` in a text editor and modify the `campaignData` object to suit your game.

### Campaign Settings
Update `campaignData.settings.title` and `subtitle` to change the main header of the website.

### Characters
Each character in `campaignData.characters` requires the following fields:
- `id`: A unique string (e.g., "char_1").
- `name`: Character's name.
- `pitch`: A one-line summary archetype.
- `icon`: An emoji representing the character (e.g., "🗣️").
- `concept`, `trouble`, `aspect`: Fate Aspects.
- `approaches`: An object with the 6 Fate Accelerated approaches.
- `stunts`: An array of stunt strings.
- `publicBackstory`: Text visible to all players.
- `gmSecrets`, `gmHooks`: Text visible only in the GM view.



## How to Host for Free
Since this is a static site (HTML/CSS/JS only), you can host it for free easily:

**Option 1: GitHub Pages (Recommended)**
1. Create a free GitHub account.
2. Create a new repository and upload all these files.
3. Go to the repository's Settings > Pages.
4. Select the `main` branch as the source and save.
5. Your site will be live at `https://yourusername.github.io/your-repo-name/`.

**Option 2: Netlify**
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the folder containing these files into the upload box.
3. Netlify will instantly provide a live URL for your site.

