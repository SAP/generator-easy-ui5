# Easy UI5 Generator Test Scenarios

In the root directory of Easy UI5 just execute the following commands and check that it is working.

## Scenario 1: Standard Usage

Retrieve the list of generators from the `ui5-community` GitHub organisation:

```sh
yo ./
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Select your generator? (Use arrow keys)
❯ library
  middleware
  task
  control
  project
  app
  ts-app
  flp-plugin
```

By specifying an `addGhOrg` additional entries should be displayed:

```sh
yo ./ --addGhOrg=petermuessig
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Select your generator? (Use arrow keys)
❯ library [ui5-community]
  middleware [ui5-community]
  task [ui5-community]
  control [ui5-community]
  project [ui5-community]
  app [ui5-community]
  ts-app [ui5-community]
  flp-plugin [ui5-community]
```

## Scenario 2: Next Usage

Retrieve the list of generators from bestofui5.org:

```sh
yo ./ --next
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Select your generator? (Use arrow keys)
❯ project
  ts-app
  ts-app-fcl
  flp-plugin
  library
  control
```

## Scenario 3: Offline Usage

Retrieve the list of generators from bestofui5.org:

```sh
yo ./ --offline
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

Running in offline mode!
? Select your generator? (Use arrow keys)
❯ library
  project
  ts-app
```

## Scenario 4: Generator From GitHub Repository

```sh
yo ./ SAP-samples/ui5-typescript-tutorial
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? How do you want to name this application? (myapp)
```
