const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Welcome, Admin!</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Pending Approvals</h3>
          <p className="text-gray-600">
            View and approve new teams, coaches, and players.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Registered Teams</h3>
          <p className="text-gray-600">
            Manage existing teams in your league.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Reports</h3>
          <p className="text-gray-600">
            View match and performance reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
