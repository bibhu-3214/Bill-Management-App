let num = [1, 2, 3, 4, 5, 6, 7, 8];
let count = 0;

let filteredNum = num.filter((num) => {
   if (num % 2 === 0) {
      count++;
   }
   return num;
});

console.log(filteredNum);
