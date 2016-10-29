# Torako 虎子

[FoolFuuka](https://github.com/FoolCode/FoolFuuka) (and soon vanilla [Fuuka](https://github.com/eksopl/fuuka)) downloader - Archiving the archivers

# Instructions

## Step 0: Install

- Clone this repo to a directory
- In that directory, run: `npm install`

## Step 1: Get threads

- Fill the [`config.json`](config.json) file with the URL for the archive and the boards you want (everything else can stay the same)
- Run: `node 1_get_threads.js`
- It will make a `data/` folder, and for each board you chose, it will make a `boardname.json` file in the root of that directory with the list of threads on that board

## Step 2: Download JSON

- Run: `node 2_download_json.js`
- In the `data/` folder, for each board, it will make a folder that will contain all of the threads for that board
- For each thread, it will divide it up into strings of 1-4 digits, and it will make encapsulating folders for each to put the JSON in (just run it if you don't know what I mean)
