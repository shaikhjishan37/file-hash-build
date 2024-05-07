# file-hash-build
File hasher based on content and impact on any referenced places in a repo

### Command
```
npx hashfiles -folder=#FOLDERPATH# -fileExtension=#FILE-EXTENSION# -postProcessCleanUpPath=#PROCESS-FILE-PATH# -impactFilesPath=#IMPACTED-ROOT-FOLDER#
```

### -folder
```
Multiple args can be passed with same key.
This is used to specify folder location where files are needed to be hashed.
If multiple folder are needed pass same arg multiple times with path of all folders

Example: -folder=/data/username/myprj
```

### -fileExtension

```
Multiple args can be passed with same key.
This is used to specify which files extension or type are needed to be hashed.
If multiple filetypes are needed to be hashed pass this argument multiple time in command.

Example: -fileExtension=.js -fileExtension=.css
```

### -postProcessCleanUpPath
```
After files are hashed this needs to be updated in code base wherever they are needed.
File paths have some root folder from where we refrence them, for for replace we want to remove extra path from file which needs to be cleaned up.

Example: -folder=/data/user/myprj -postProcessCleanUpPath=/data/user/
```

### -impactFilesPath

```
Impacted files where new path need to updated can be provided on arg, if not provided root folder where command was run will be considered in use for this
```
