if [$1 == ""]
then
    echo "Enter a name of the GitHub repository as the argument."
    exit 1
fi

git remote set-url origin https://github.com/jwgerlach00/$1
git remote add upstream https://github.com/jwgerlach00/vuetify3_boilerplate
git push origin master
git push --all
