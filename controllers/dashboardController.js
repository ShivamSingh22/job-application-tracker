const JobApplication = require('../models/jobApplicationModel');
const sequelize = require('../util/database');
const { Op } = require('sequelize');

exports.getDashboardData = async (req, res) => {
    console.log('getDashboardData called');
    try {
        const userId = req.user.id;
        console.log('User ID:', userId);

        // Get status counts
        console.log('Fetching status counts...');
        const statusCounts = await JobApplication.findAll({
            where: { userId },
            attributes: ['status', [sequelize.fn('count', sequelize.col('status')), 'count']],
            group: ['status']
        });
        console.log('Status counts:', statusCounts);

        // Get timeline data (applications per day for the last 30 days)
        console.log('Fetching timeline data...');
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        const timelineData = await JobApplication.findAll({
            where: {
                userId,
                applicationDate: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            attributes: [
                [sequelize.fn('date', sequelize.col('applicationDate')), 'date'],
                [sequelize.fn('count', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('date', sequelize.col('applicationDate'))],
            order: [[sequelize.fn('date', sequelize.col('applicationDate')), 'ASC']]
        });
        console.log('Timeline data:', timelineData);

        // Get recent applications
        console.log('Fetching recent applications...');
        const recentApplications = await JobApplication.findAll({
            where: { userId },
            order: [['applicationDate', 'DESC']],
            limit: 5
        });
        console.log('Recent applications:', recentApplications);

        // Simplified response
        res.status(200).json({
            statusCounts: statusCounts.reduce((acc, item) => {
                acc[item.status] = parseInt(item.get('count'));
                return acc;
            }, {}),
            timelineData: timelineData.map(item => ({
                date: item.get('date'),
                count: parseInt(item.get('count'))
            })),
            recentApplications: recentApplications.map(app => ({
                jobTitle: app.jobTitle,
                companyName: app.companyName,
                status: app.status,
                applicationDate: app.applicationDate
            }))
        });
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};