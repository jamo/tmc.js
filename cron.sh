
export EDITOR=true

if [ -z "$NODE"  ]; then
  NODE="node"
fi
if [ -z "$NPM" ]; then
  NPM=$(which npm)
fi
if [ -z "$SEMVER" ]; then
  SEMVER="$NODE $($NPM bin)/semver"
fi

$NPM run update >/dev/null

# check if the working tree is "dirty"
git diff --quiet bin/tmc
DIRTY=$?

if [ $DIRTY = "1" ]; then
  # commit the changes to the `index.js` file
  git add bin/tmc
  git add package.json
  VERSION=$($NODE -p "require('./package').version")
  git commit -m "Update binary to $VERSION"
  git tag $VERSION
  #git push origin master
  $NPM publish
fi;
