import { Request, Response } from "express";

import Joi from "joi";

import Agendamentos from "../models/Agendamentos.js";
import Servicos from "../models/Servicos.js";
import AgendamentosServicos from "../models/AgendamentosServicos.js";

const agendamentoServicoSchemaCreate = Joi.object({
  id_agendamento: Joi.number().required(),
  id_servico: Joi.number().required(),
});

const agendamentoServicoSchemaUpdate = Joi.object({
  id: Joi.number().required(),
  id_agendamento: Joi.number().required(),
  id_servico: Joi.number().required(),
});

export default class AgendamentoServicos {
  static validadeAgendamentoServicoData(data: any, isUpdate: boolean = false) {
    const schema = isUpdate
      ? agendamentoServicoSchemaUpdate
      : agendamentoServicoSchemaCreate;

    const { error, value } = schema.validate(data);

    if (error) {
      const message = "Dados inválidos.";
      const details = error.details.map((detail: Joi.ValidationErrorItem) => {
        switch (detail.path[0]) {
          case "id_agendamento":
            return "Agendamento informado está inválido ou não existe.";
          case "id_servico":
            return "Serviço informado está inválido ou não existe.";

          default:
            return "Não é possível inserir ou atualizar outros dados além do agendamento e serviço";
        }
      });
      return { valid: false, message, details };
    }
    return { valid: true, value };
  }

  static async agendamentoExists(agendamentoID: number) {
    const agendamento = await Agendamentos.findOne({
      where: { id: agendamentoID },
    });

    if (agendamento) return true;
    return false;
  }

  static async servicoExists(servicoId: number) {
    const servico = await Servicos.findOne({
      where: { id: servicoId },
    });

    if (servico) return true;
    return false;
  }

  static async readAllAgendamentosServicos(req: Request, res: Response) {
    try {
      const agendamentosServicos = await AgendamentosServicos.findAll({
        raw: true,
      });

      if (!agendamentosServicos || agendamentosServicos.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum agendamento de serviço foi encontrado." });
      }

      res.status(200).json({
        message: "Agendamentos de serviços resgatados com sucesso.",
        data: agendamentosServicos,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Erro ao resgatar todos os agendamentos de serviços.",
      });
    }
  }

  static async readAgendamentosServicos(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const updatedAgendamentoServico = await AgendamentosServicos.findOne({
        where: { id: id },
      });

      if (!updatedAgendamentoServico) {
        return res
          .status(404)
          .json({ message: "Nenhum agendamento de serviço foi encontrado." });
      }

      res.status(200).json({
        message: "Agendamento de serviços resgatado com sucesso.",
        data: updatedAgendamentoServico,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao resgatar todos os serviços." });
    }
  }

  static async createAgendamentosServicos(req: Request, res: Response) {
    const { valid, value, message, details } =
      this.validadeAgendamentoServicoData(req.body);

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    try {
      const agendamento = await this.agendamentoExists(value.id_agendamento);

      if (!agendamento) {
        return res
          .status(500)
          .json({ message: "Agendamento informado não foi encontrado." });
      }

      const servico = await this.servicoExists(value.id_servico);

      if (!servico) {
        return res
          .status(500)
          .json({ message: "Serviço informado não foi encontrado." });
      }

      const newAgendamentoServicos = await AgendamentosServicos.create({
        id_agendamento: value.id_agendamento,
        id_servico: value.id_servico,
      });

      const newAgendamentoServicosPlain = newAgendamentoServicos.get({
        plain: true,
      });

      const agendamentoServico = await AgendamentosServicos.findOne({
        where: { id: newAgendamentoServicosPlain.id },
      });

      if (!agendamentoServico) {
        return res.status(404).json({
          message: "O agendamento de serviço criado não foi encontrado.",
        });
      }

      res.status(200).json({
        message: "Agendamento de serviço criado com sucesso.",
        data: agendamentoServico,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao criar agendamento de serviço." });
    }
  }

  static async updateAgendamentosServicos(req: Request, res: Response) {
    const { valid, value, message, details } =
      this.validadeAgendamentoServicoData(req.body, true);

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    try {
      const agendamentoServicoExist = await AgendamentosServicos.findOne({
        where: { id: value.id },
      });

      if (!agendamentoServicoExist) {
        return res.status(500).json({
          message: "Agendamento de serviços informado não foi encontrado.",
        });
      }

      const agendamento = await this.agendamentoExists(value.id_agendamento);

      if (!agendamento) {
        return res
          .status(500)
          .json({ message: "Agendamento informado não foi encontrado." });
      }

      const servico = await this.servicoExists(value.id_servico);

      if (!servico) {
        return res
          .status(500)
          .json({ message: "Serviço informado não foi encontrado." });
      }

      const newAgendamentoServicos = {
        id_agendamento: value.id_agendamento,
        id_servico: value.id_servico,
      };

      await AgendamentosServicos.update(newAgendamentoServicos, {
        where: { id: value.id },
      });

      const updatedAgendamentoServico = await AgendamentosServicos.findOne({
        where: { id: value.id },
      });

      if (!updatedAgendamentoServico) {
        return res
          .status(404)
          .json({ message: "O agendamento atualizado não foi encontrado." });
      }

      res.status(200).json({
        message: "Agendamentos de serviços atualizado com sucesso.",
        data: updatedAgendamentoServico,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao atualizar agendamento de serviço." });
    }
  }

  static async deleteAgendamentosServicos(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const updatedAgendamentoServico = await AgendamentosServicos.findOne({
        where: { id: id },
      });

      if (!updatedAgendamentoServico) {
        return res.status(404).json({
          message: "Agendamento de serviços informado não foi encontrado.",
        });
      }

      await AgendamentosServicos.destroy({ where: { id: id } });

      res.status(200).json({
        message: "Agendamento de Serviço removido com sucesso.",
        data: updatedAgendamentoServico,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erro ao remover Agendamento de Serviço." });
    }
  }

  static async resetModel() {
    await AgendamentosServicos.drop();

    await AgendamentosServicos.sync({ force: true });

    console.log(
      `Tabela ${AgendamentosServicos.tableName} foi resetada com sucesso!`
    );
  }
}
