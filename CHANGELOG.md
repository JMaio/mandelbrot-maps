# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.2](https://github.com/fraserdscott/mandelbrot-maps/compare/v1.3.0...v1.3.2) (2021-04-10)

### Features

- **tans-theorem:** add back yarn.lock ([86098fd](https://github.com/fraserdscott/mandelbrot-maps/commit/86098fd59cad8db272c717b11c0bd5d59cdccd67))
- **tans-theorem:** ui overhaul ([e583548](https://github.com/fraserdscott/mandelbrot-maps/commit/e5835488d2af0d43a2ce9bfe3fa48075e0654aac))
- **tans-theorem:** unify animation progress bar ([6ab9646](https://github.com/fraserdscott/mandelbrot-maps/commit/6ab96462f2178a94634fa9a94b1ec7e27fccb8b0))

### Bug Fixes

- **tans-theorem:** fix domains and update its ui ([74e8e3f](https://github.com/fraserdscott/mandelbrot-maps/commit/74e8e3f9c7ce8e8ea811774e9a9c495ace5a47fd))
- **tans-theorem:** update markers on domain switch ([7e83fed](https://github.com/fraserdscott/mandelbrot-maps/commit/7e83fedff2f11d15637e3069b57dac059cb054e8))

## [1.3.0](https://github.com/JMaio/mandelbrot-maps/compare/v1.2.0...v1.3.0) (2021-03-23)

### Features

- **tans-theorem-explorer:** tans theorem explorer ([256e29f](https://github.com/JMaio/mandelbrot-maps/commit/256e29f07608aae525a7a859740636bc47444d63))

### Bug Fixes

- **tans-theorem:** refactor points list ([c875204](https://github.com/JMaio/mandelbrot-maps/commit/c8752044d1897f64856c747038684f898bb8ac7a))
- **tans-theorem:** refactor points list to use index ([b5b3d05](https://github.com/JMaio/mandelbrot-maps/commit/b5b3d05f455fbbf03b06b1740b8e2e922f401c8d))

## [1.2.0](https://github.com/JMaio/mandelbrot-maps/compare/v1.1.1...v1.2.0) (2021-03-02)

### Features

- **controls:** add rotation indicator and reset to minimaps ([098d24f](https://github.com/JMaio/mandelbrot-maps/commit/098d24f8827a27f293f304a4314087dac261e80a))
- **perturbation-theory:** add deep zoom control to settings ([c970135](https://github.com/JMaio/mandelbrot-maps/commit/c97013516480bc84b1aecd8b1446343a41313e72))
- **perturbation-theory:** change precision dynamically ([220afa0](https://github.com/JMaio/mandelbrot-maps/commit/220afa034787cc4bd4f9f655cfcfac2fe918b641))
- **perturbation-theory:** re-add crosshair, update colour scheme ([be2ba58](https://github.com/JMaio/mandelbrot-maps/commit/be2ba589c9f2d86881db0a1c655f8a54fea7b979))
- **perturbation-theory:** start port from deepfractal! (kinda broken) ([2fa2b88](https://github.com/JMaio/mandelbrot-maps/commit/2fa2b88afab18b37a69cc859cc912724d9042a91))
- **perturbation-theory:** wow, that actually worked... deep-fractal shader up and running ([2250403](https://github.com/JMaio/mandelbrot-maps/commit/22504039e60118f83689992fd30c2f7fa9b442c0))

### Bug Fixes

- **controls:** remove zoom clamping to fixed value ([11c0d7c](https://github.com/JMaio/mandelbrot-maps/commit/11c0d7cef2ccbd4617f1e5fcb69f75880c94255f))
- **deploy:** run "git describe" with "--tags" to include tag number ([5a04712](https://github.com/JMaio/mandelbrot-maps/commit/5a047122427c8896b80da6c5b46394a379b7ee27))

### [1.1.1](https://github.com/JMaio/mandelbrot-maps/compare/v1.1.0...v1.1.1) (2021-02-11)

## [1.1.0](https://github.com/JMaio/mandelbrot-maps/compare/v1.0.3...v1.1.0) (2021-02-11)

### Features

- **gesture:** extract common gesture logic (like panning) ([a7d4549](https://github.com/JMaio/mandelbrot-maps/commit/a7d4549e69d1e8578877160af9c4b9a5531bb7a0))
- **info:** add extensible help dialog (md --> help page) ([196f09b](https://github.com/JMaio/mandelbrot-maps/commit/196f09bff29b29c5f9b9194dd871567daa7df543))
- **info:** add screen size property to device info ([330ccdf](https://github.com/JMaio/mandelbrot-maps/commit/330ccdf17b68a4775346609c1ecb0b0789138faf))
- **info:** add settings descriptions to help dialog ([81d3c26](https://github.com/JMaio/mandelbrot-maps/commit/81d3c269b23aa92297681bbd205c8bcf4eaaaba6))
- **info:** create simple help dialog ([7f07625](https://github.com/JMaio/mandelbrot-maps/commit/7f07625a95c7f80b0b5312af2e964d745d83347f))
- **info:** start adding settings helptext ([3759399](https://github.com/JMaio/mandelbrot-maps/commit/3759399341da560eb6e160076ad4a048f6f42f19))
- **info:** use markdown instead of hardcoded JSX ([8ed1d52](https://github.com/JMaio/mandelbrot-maps/commit/8ed1d521de9672c5ed0f65597a73118feb372960))
- **ui:** add view basic changer functionality ([b3e4d79](https://github.com/JMaio/mandelbrot-maps/commit/b3e4d79f2dfb487265b2bd2b94ed205bc07e97ec))
- **webgl:** set shader float precision conditionally ([1b15116](https://github.com/JMaio/mandelbrot-maps/commit/1b151168c2387c82b21d15d8a4628551cb844ea8))

### Bug Fixes

- **deploy:** explicitly call yarn "pre" and "post" ([effcd1a](https://github.com/JMaio/mandelbrot-maps/commit/effcd1acdfae3a442b94539f1d7dff80fce412b0))
- **dev:** add https start script ([698433a](https://github.com/JMaio/mandelbrot-maps/commit/698433ae5d9900a4e5505f9c16fabd031973ca5d))
- **dpr:** update DPR logic, pass value down via props ([54e9bee](https://github.com/JMaio/mandelbrot-maps/commit/54e9beef4316326ae7f7aa58922eba8942c62887))
- **import:** add view changer import ([83a65e5](https://github.com/JMaio/mandelbrot-maps/commit/83a65e5c728c078aafbfcca77d91d754d9009190))
- **info:** actually import the Markdown tag ([c78c0b4](https://github.com/JMaio/mandelbrot-maps/commit/c78c0b4dffde78c3bf9f1787c47871c325a551dc))
- **info:** add return type to markdown component ([18056cd](https://github.com/JMaio/mandelbrot-maps/commit/18056cd5669329680ff865b9c131fbc4fabd7860))
- **info:** improve settings display help, make interactive ([55e5fb1](https://github.com/JMaio/mandelbrot-maps/commit/55e5fb1fff5166f3379806d2e992a9e74029480b))
- **info:** rework help components to cache md files ([9635a58](https://github.com/JMaio/mandelbrot-maps/commit/9635a58431168bc197caabc411c3dd682ca6caf9))
- **info:** update snackbar logic ([2c137cd](https://github.com/JMaio/mandelbrot-maps/commit/2c137cd5830618fe36b1f827e00afdf962232714))
- **lint:** update eslint / prettier ([a25eb95](https://github.com/JMaio/mandelbrot-maps/commit/a25eb958d2db59077d3e42562102ef5e033ae776))
- **lint:** update prettier settings ([2d7a9b4](https://github.com/JMaio/mandelbrot-maps/commit/2d7a9b49c7859569d5d3029a37f8001e3579c388))
- **lint:** update vscode formatOnSave settings ([3944581](https://github.com/JMaio/mandelbrot-maps/commit/3944581d3aaa8a101b291f034edb61b43384419d))
- **misc:** make "copy device properties" button more explicit with "copy info" ([961dbfb](https://github.com/JMaio/mandelbrot-maps/commit/961dbfb521e3b482b991858f450469e05ff5bc18))
- **openapi:** update openapi tags, keywords ([c5390cb](https://github.com/JMaio/mandelbrot-maps/commit/c5390cb067737167713c8446ad068e887c322694))
- **pwa:** explicitly add workbox for PWA support ([a2e0247](https://github.com/JMaio/mandelbrot-maps/commit/a2e02470ecf4a0e9c47dc0f184b54c25ab56e424)), closes [/github.com/facebook/create-react-app/issues/9776#issuecomment-728945921](https://github.com/JMaio//github.com/facebook/create-react-app/issues/9776/issues/issuecomment-728945921)
- **pwa:** make logo maskable, update to minimal ui ([a1b1669](https://github.com/JMaio/mandelbrot-maps/commit/a1b16693d58af6f6455e742882ccdc8557aa5bc7))
- **pwa:** remove old favicons, new opengraph image under 300kb ([b4ec5be](https://github.com/JMaio/mandelbrot-maps/commit/b4ec5be52589c197bedc1b19c74bea60b712e5ac))
- **pwa:** rename manifest according to w3 ([b446ef0](https://github.com/JMaio/mandelbrot-maps/commit/b446ef03e040affd4da8e3858429aee8bd0b472a))
- **pwa:** revert app display style to "standalone" (will use share api) ([79da008](https://github.com/JMaio/mandelbrot-maps/commit/79da00898570792fe1651c294bc201010c58153a))
- **pwa:** update logo to have purpose "any" ([416a8a4](https://github.com/JMaio/mandelbrot-maps/commit/416a8a4b0e58356dff3c8d061a7b188ab1f9549e))
- **versioning:** use git describe for version info ([99f71a2](https://github.com/JMaio/mandelbrot-maps/commit/99f71a2f99511ae90700247c0ff04085e872aa6c))

### [1.0.3](https://github.com/JMaio/mandelbrot-maps/compare/v1.0.2...v1.0.3) (2020-12-25)

### Features

- **versioning:** add standard-version and commitlint for versioning ([d103909](https://github.com/JMaio/mandelbrot-maps/commit/d1039097310daec8bbc39d6b157cc25d3dc1e9a7))
- **yarn:** upgrade to yarn v2 ([51f7cfe](https://github.com/JMaio/mandelbrot-maps/commit/51f7cfe9afdc635c97a16ccdfd6653503a2f8670))

### Bug Fixes

- **deps:** upgrade husky again ([01c35d9](https://github.com/JMaio/mandelbrot-maps/commit/01c35d9e1b733a30b1ca1edd26241de457cc5025)), closes [/github.com/desktop/desktop/issues/10326#issuecomment-751263702](https://github.com/JMaio//github.com/desktop/desktop/issues/10326/issues/issuecomment-751263702)
- **image:** gitattributes - binary files should be left untouched ([838f4c1](https://github.com/JMaio/mandelbrot-maps/commit/838f4c1be242f5712a393bf36f4024cd528d885c))
- **versioning:** add minor release script ([ddfb563](https://github.com/JMaio/mandelbrot-maps/commit/ddfb5636aeb39f4e4f1ba1e47a9318db4b347c36))
