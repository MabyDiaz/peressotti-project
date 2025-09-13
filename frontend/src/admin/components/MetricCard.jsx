const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

const MetricCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorClass = colorClasses[color] || colorClasses.red;

  return (
    <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <p className='text-3xl font-bold text-gray-900'>{value}</p>
          {trend && (
            <p
              className={`text-sm ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              } flex items-center mt-1`}>
              <TrendingUp className='w-4 h-4 mr-1' />
              {trend > 0 ? '+' : ''}
              {trend}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClass}`}>
          {Icon && <Icon className='w-6 h-6' />}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
