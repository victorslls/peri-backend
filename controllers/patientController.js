const Patient = require("../models/Patient");
const Case = require("../models/Case");
const ActivityLog = require("../models/ActivityLog");

exports.createPatient = async (req, res) => {
  try {
    const { name, caseId, numberOfTeeth, hasActiveCavities } = req.body;

    // Verificar se o caso existe
    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: "Caso não encontrado",
      });
    }

    // Verificar se o caso já tem um paciente
    const existingPatient = await Patient.findOne({ case: caseId });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Este caso já possui um paciente vinculado",
      });
    }

    const patient = new Patient({
      name: name || null,
      case: caseId,
      numberOfTeeth,
      hasActiveCavities,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    await patient.save();

    // Registrar atividade
    await ActivityLog.create({
      userId: req.user.id,
      action: "Paciente adicionado",
      details: `Paciente ${patient.identificationStatus} adicionado ao caso ${caseId}`,
    });

    const populatedPatient = await Patient.findById(patient._id)
      .populate("case", "title")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    res.status(201).json({
      success: true,
      message: "Paciente adicionado com sucesso",
      data: populatedPatient,
    });
  } catch (error) {
    // Se o erro for de duplicidade (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Este caso já possui um paciente vinculado",
      });
    }

    console.error("Erro ao criar paciente:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar paciente",
      error: error.message,
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user.id,
    };

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Paciente não encontrado",
      });
    }

    // Atualizar paciente
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("case", "title")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    // Registrar atividade
    await ActivityLog.create({
      userId: req.user.id,
      action: "Paciente atualizado",
      details: `Paciente ${updatedPatient.identificationStatus} atualizado`,
    });

    res.json({
      success: true,
      message: "Paciente atualizado com sucesso",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar paciente",
      error: error.message,
    });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId)
      .populate("case", "title")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Paciente não encontrado",
      });
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar paciente",
      error: error.message,
    });
  }
};

exports.getPatientsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Verificar se o caso existe
    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: "Caso não encontrado",
      });
    }

    const patients = await Patient.find({ case: caseId })
      .populate("case", "title")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error("Erro ao buscar pacientes do caso:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar pacientes do caso",
      error: error.message,
    });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Paciente não encontrado",
      });
    }

    await patient.remove();

    // Registrar atividade
    await ActivityLog.create({
      userId: req.user.id,
      action: "Paciente removido",
      details: `Paciente ${patient.identificationStatus} removido do caso ${patient.case}`,
    });

    res.json({
      success: true,
      message: "Paciente removido com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover paciente:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao remover paciente",
      error: error.message,
    });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Patient.countDocuments();
    const patients = await Patient.find()
      .populate("case", "title")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: patients,
      pagination: {
        currentPage: page,
        totalPages: pages,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error("Erro ao listar pacientes:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar pacientes",
      error: error.message,
    });
  }
};
