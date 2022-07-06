#!/usr/bin/env bash

#
# Folders that contain sources with calls to translations.
#
SOURCE_FOLDERS=(
  "../src"
  "../ui_components"
)

#
# Translations extracted from st4 reside in this xml.
#
TRANSLATIONS="../configs/translations.xml"

TMP_USED="/tmp/used.txt"
TMP_EXISTING="/tmp/existing.txt"

init() {
  echo "" >$TMP_USED
  echo "" >$TMP_EXISTING
}

clean() {
  rm $TMP_USED $TMP_EXISTING
}

get_used_translations() {
  for folder in ${SOURCE_FOLDERS[*]}; do
    grep -REo "i18n\.(t|n)\('.*'\)" "$folder" | cut -d ":" -f2 | cut -d "'" -f2 >>$TMP_USED
  done
}

get_existing_translations() {
  # Ugly hack with shell because xmllint doesn't print every match separately.
  xmllint --shell "$TRANSLATIONS" <<<"cat //export/entries/entry/name/text()" >>$TMP_EXISTING
  sed -ie "/ -------/d" $TMP_EXISTING
}

# Find elements that are in used but not in existing.
# Set find_non_existing_used A \ B
find_non_existing_used() {
  comm -23 <(sort -uf $TMP_USED) <(sort -uf $TMP_EXISTING)
}

#
# Main.
#
init
get_used_translations
get_existing_translations
echo "-- Used translation keys without translation"
find_non_existing_used
clean
