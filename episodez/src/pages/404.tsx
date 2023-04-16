// Kopierad från https://patorjk.com/software/taag/#p=display&f=Big&t=404
const text =  `
             
 ___ ___ ___ 
| | |   | | |
|_  | | |_  |
  |_|___| |_|
             
             
             
             
             
             
             
                                                      
`
export default function NotFoundPage() {
  return (
    <main className="w-full text-center">
      <pre>{text}</pre>
    </main>
  );
}
