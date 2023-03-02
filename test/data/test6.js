function foo(a) {
  console.log(a);
  let b = function() {
    console.log('pl');
  }
  b();
}
foo(() => {
  console.log('hi');
});