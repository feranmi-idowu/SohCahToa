
type User = {
  name: string,
  balance: number,
  isAdmin: boolean
}
export default function Home() {
  const user: User = {
    name: "Emmanuel Israel",
    balance: 6870,
    isAdmin: true,
  }
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Balance: ${user.balance}</p>
      <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
    </div>
  );
}

