function foo(a) {
  console.log(`Enteringfoo(${a})atline1`);
  console.log(a);
  letb = function() {
    console.log(`Entering<anonymousfunction>()atline3`);
    console.log('pl');
  };
  b();
}
foo(()=>{console.log(`Entering<anonymousfunction>()atline8`);
console.log('hi');});