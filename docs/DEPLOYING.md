# Deploying using GitHub pages

Deploying a build to GitHub pages makes it simple to access the application on any device, without the need to constantly run a development (or production server).

React can create a production build, which involves "bundling" the source code into a few JavaScript and CSS files, that can then be statically deployed (no server).

To deploy and host a production build, you should:

0.  (Fork the repo to have your own working copy)

1.  On your repo's Settings tab on GitHub, under the "Options" menu, scroll down to the "GitHub Pages" section. There, under "Source", select the `gh-pages` branch from the drop-down menu, and click "Save".
    ![GitHub pages section, no branch selected for deployment.](/img/gh-settings-gh-pages-none.png)
    
    After a few seconds, you should see this message - keep a note of the URL as it's needed later: >Your site is published at https://[yourusername].github.io/mandelbrot-maps/

    ![GitHub pages section, the gh-pages branch is selected for deployment.](/img/gh-settings-gh-pages.png)

2.  Open a terminal at the root of the repo and, depending on your package manager, run the `deploy` task (which calls the `gh-pages` package to deploy to GitHub). With `yarn`:

        yarn run deploy

    With `npm`:

        npm run deploy

    You should see React creating a production build. After about 20-40 seconds, there should be a success message:

    ![Successful deployment to GitHub pages](/img/deploy.png)

3.  Go to the URL and the app should be live there! Check that the version is correct by going into the [Settings] > [About] menu and scrolling to the bottom - the "Build" value should show the time when the app was built and deployed (in UTC).

4.  Repeat the process when there's a new build to be deployed.
    Keep in mind that `gh-pages` will deploy what is currently on your local machine, and **not** from a specific branch, so make sure to checkout the correct branch before deploying.
