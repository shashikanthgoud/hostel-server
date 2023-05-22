// Function to format the date as dd-mm-yyyy
// export const formatDate = (date:Date): String => {
//   if(date){
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   } else {
//     return '';
//   }
// }

// export const formatDate = (date: Date): string => {
//     const options: Intl.DateTimeFormatOptions = {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     };
  
//     return new Intl.DateTimeFormat('en-US', options).format(date);
//   };
  