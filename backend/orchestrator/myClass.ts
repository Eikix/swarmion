export class MyClass {
  constructor(public myString: string) {
    console.log('constructor is running');
  }
  getSavedString(): string {
    return this.myString;
  }
}
