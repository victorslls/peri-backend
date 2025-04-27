const DentalRecord = require('../models/DentalRecord');
const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

exports.createDentalRecord = async (req, res) => {
  const { patientName, isIdentified, dentalData } = req.body;

  try {
    const record = new DentalRecord({
      patientName,
      isIdentified,
      dentalData,
      registeredBy: req.user.id,
    });

    await record.save();
    await ActivityLog.create({ userId: req.user.id, action: 'Registro odonto-legal criado', details: record._id });

    res.status(201).json(record);
  } catch (error) {
    logger.error('Erro ao criar registro odonto-legal:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.searchDentalRecords = async (req, res) => {
  const { query } = req.query;

  try {
    const records = await DentalRecord.find({ $text: { $search: query } });
    res.json(records);
  } catch (error) {
    logger.error('Erro ao buscar registros odonto-legais:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};