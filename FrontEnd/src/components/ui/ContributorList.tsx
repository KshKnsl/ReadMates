import UserName from "./UserName";

function ContributorList({ articleData }: { articleData: string[] }) {

  return (
    <ul>
      {articleData.map((contributor, index) => (
        <li key={index} className="bg-amber-100 dark:bg-amber-800 p-2 rounded dark:text-white hover:dark:text-indigo-50">
          {index + 1}. <UserName userId={contributor} />
        </li>
      ))}
    </ul>
  );
}
export default ContributorList;
