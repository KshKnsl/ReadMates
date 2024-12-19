import Badge from '../components/Badge'
import { Award, Lock, CheckCircle } from 'lucide-react';
import { badges } from '../constants';

const Rewards = () => {
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto max-w-7xl">
      {/* Header with Stats and Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Rewards Overview Card */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Award className="w-10 h-10 mr-4 text-amber-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Rewards Journey</h1>
                <p className="text-sm text-gray-600">Badges, achievements, and your progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl font-bold text-amber-600">
                  {earnedBadges.length}/{badges.length}
                </div>
                <div className="text-xs text-gray-500">Badges Earned</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-amber-600 h-2.5 rounded-full" 
              style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
            ></div>
          </div>
        </div>
  
        {/* Quick Tips Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.02]">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Tips</h2>
          <ul className="space-y-2">
            {[
              "Publish regularly",
              "Engage with community",
              "Provide valuable feedback",
              "Stay consistent"
            ].map((tip, index) => (
              <li 
                key={index} 
                className="flex items-center text-sm text-gray-700 hover:text-amber-600 transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2 text-amber-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
  
      {/* Badges Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Earned Badges */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.01]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Earned Badges</h2>
            <div className="text-sm text-gray-600">
              {earnedBadges.length} / {badges.length} Completed
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <div 
                key={badge.name} 
                className="flex flex-col items-center transform transition-transform hover:scale-110"
              >
                <Badge {...badge} />
                <span className="text-xs text-gray-600 mt-2 text-center">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
  
        {/* Badges to Earn */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all hover:scale-[1.01]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Badges</h2>
          <div className="space-y-4">
            {unearnedBadges.map((badge) => (
              <div 
                key={badge.name} 
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center">
                  <Badge {...badge} />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                </div>
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>  );
};

export default Rewards;

