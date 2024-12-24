import UserName from "./UserName";

function ContributorList({ articleData }: { articleData: string[] }) {

  return (
    <ul>
      {articleData.map((contributor, index) => (
        <li key={index} className="bg-amber-100 p-2 rounded">
          {index + 1}. <UserName userId={contributor} />
        </li>
      ))}
    </ul>
  );
}
export default ContributorList;
