render_price() {
  cents=$1
  printf '$%d.%02d\n' $((cents / 100)) $((cents % 100))
}
