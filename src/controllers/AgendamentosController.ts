import { Request, Response } from "express";
import { Op } from "sequelize";
import Joi from "joi";

import { startOfWeek, endOfWeek } from "date-fns";
import Sequelize from "sequelize";

import Agendamentos from "../models/Agendamentos.js";
import Pets from "../models/Pets.js";
import Clientes from "../models/Clientes.js";
import Servicos from "../models/Servicos.js";
import AgendamentosServicos from "../models/AgendamentosServicos.js";

const agendamentoSchemaCreate = Joi.object({
  data_agendamento: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)
    .required(),
  id_pet: Joi.number().required(),
  situacao: Joi.string().valid("sim", "Sim", "Nao", "nao", "Não", "não", ""),
  desconto: Joi.string().pattern(/^\d{1,4}$/),
  observacao: Joi.string().min(0).max(255),
});

const agendamentoSchemaUpdate = Joi.object({
  id: Joi.number().required(),
  data_agendamento: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Data e hora devem estar no formato DD/MM/YYYY HH:mm",
    }),
  id_pet: Joi.number().required(),
  situacao: Joi.string().valid("sim", "Sim", "Nao", "nao", "Não", "não", ""),
  desconto: Joi.string().pattern(/^\d{1,4}$/),
  observacao: Joi.string().min(0).max(255),
});

const AgendamentoByMonthSchema = Joi.object({
  mes_ano: Joi.string()
    .pattern(/^\d{2}\/\d{4}$/)
    .custom((value, helpers) => {
      const [mes, ano] = value.split("/");
      const mesNumero = parseInt(mes, 10);

      if (mesNumero < 1 || mesNumero > 12) {
        return helpers.error("any.custom", {
          message: "Mês deve estar entre 01 e 12",
        });
      }

      return value;
    })
    .required(),
});

const AgendamentoByDateSchema = Joi.object({
  dia_mes_ano: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    .required(),
});

const formatPrice = (price: number) => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatToDateBR = (date: any) => {
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
};
const convertToDateType = (dataString: string) => {
  const [date, time] = dataString.split(" ");
  const [day, month, year] = date.split("/").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute);
};

interface Agendamento {
  id: number;
  data_agendamento: Date;
  id_pet: number;
  situacao: boolean;
  desconto?: number;
  observacao?: string;
}

export default class AgendamentosController {
  static validadeFilterByMonthData(data: any) {
    const { error, value } = AgendamentoByMonthSchema.validate(data);

    if (error) {
      const message = "Data inválida.";
      const details = error.details.map((detail: Joi.ValidationErrorItem) => {
        switch (detail.path[0]) {
          case "mes_ano":
            return "Data informada está inválida ou não existe.";
          default:
            return "Não é possível buscar agendamento por outros dados além do ano e mês.";
        }
      });
      return { valid: false, message, details };
    }
    return { valid: true, value };
  }

  static validadeFilterByDateData(data: any) {
    const { error, value } = AgendamentoByDateSchema.validate(data);

    if (error) {
      const message = "Data inválida.";
      const details = error.details.map((detail: Joi.ValidationErrorItem) => {
        switch (detail.path[0]) {
          case "dia_mes_ano":
            return "Data informada está inválida ou não existe.";
          default:
            return "Não é possível buscar agendamento por outros dados além do ano, mês e dia.";
        }
      });
      return { valid: false, message, details };
    }
    return { valid: true, value };
  }

  static validadeAgendamentoData(data: any, isUpdate: boolean = false) {
    const schema = isUpdate ? agendamentoSchemaUpdate : agendamentoSchemaCreate;

    const { error, value } = schema.validate(data);

    if (error) {
      const message = "Dados inválidos.";
      const details = error.details.map((detail: Joi.ValidationErrorItem) => {
        switch (detail.path[0]) {
          case "data_agendamento":
            return "Data informada está inválida ou não existe.";
          case "id_pet":
            return "Pet informado está inválido ou não existe.";
          case "situacao":
            return "Situação informada está inválida ou não existe";
          case "desconto":
            return "Desconto informado está inválido.";
          case "observacao":
            return "Observação informada está inválida.";
          default:
            return "Não é possível inserir ou atualizar outros dados além da data do agendamento, pet, situação, desconto e observação.";
        }
      });
      return { valid: false, message, details };
    }
    return { valid: true, value };
  }

  static async clienteExists(clienteID: number) {
    const cliente = await Clientes.findOne({ where: { id: clienteID } });
    if (!cliente) return false;
    return true;
  }

  static async petExists(petId: number) {
    const pet = await Pets.findOne({ where: { id: petId } });
    if (!pet) return false;
    return true;
  }

  static async getFormattedAgendamento(id_agendamento: number) {
    const agendamentoData = await Agendamentos.findOne({
      where: { id: id_agendamento },
      include: [
        {
          model: Pets,
          attributes: ["nome_pet", "raca_pet", "id_cliente"],
          include: [
            {
              model: Clientes,
              attributes: ["nome_cliente", "telefone_cliente"],
            },
          ],
        },
        {
          model: AgendamentosServicos,
          include: [
            {
              model: Servicos,
              attributes: ["id", "nome_servico", "valor_servico"],
            },
          ],
          attributes: ["id"],
        },
      ],
      attributes: [
        "id",
        "data_agendamento",
        "id_pet",
        "situacao",
        "desconto",
        "observacao",
      ],
    });

    if (!agendamentoData) {
      return false;
    }

    const agendamentoPlain = agendamentoData.get({
      plain: true,
    });

    const situacao = agendamentoPlain.situacao;

    if (situacao === false) {
      agendamentoPlain.situacao = "Pendente";
    } else {
      agendamentoPlain.situacao = "Pago";
    }

    const agendamentosServicos = agendamentoPlain.agendamento_servicos || [];

    const diaSemana = agendamentoPlain.data_agendamento.toLocaleDateString(
      "pt-BR",
      {
        weekday: "long",
      }
    );

    const agendamentosServicosFormatted = agendamentosServicos.map(
      (agendamentoServico: any) => {
        const servico = agendamentoServico.servico;

        const valorFormatado = formatPrice(servico.valor_servico);

        return {
          ...agendamentoServico,
          servico: {
            ...servico,
            valor_servico: valorFormatado,
          },
        };
      }
    );

    const totalServicos = agendamentosServicos.reduce(
      (acc: number, agendamentoServico: any) =>
        acc + agendamentoServico.servico.valor_servico,
      0
    );

    const discountInNumber = parseFloat(agendamentoPlain.desconto) || 0;

    const totalInNumber =
      totalServicos === 0 ? 0 : totalServicos - discountInNumber;

    agendamentoPlain.desconto = formatPrice(discountInNumber);

    const total = formatPrice(totalInNumber);

    agendamentoPlain.data_agendamento = formatToDateBR(
      agendamentoPlain.data_agendamento
    );

    agendamentoPlain.agendamento_servicos = agendamentosServicosFormatted;

    const formattedAgendamentos = {
      ...agendamentoPlain,
      total,
      diaSemana,
    };

    return formattedAgendamentos;
  }

  static async readAllAgendamentos(req: Request, res: Response) {
    try {
      const agendamentos = await Agendamentos.findAll();

      if (!agendamentos || agendamentos.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum agendamento foi encontrado." });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos resgatados com sucesso!",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao resgatar todos os agendamentos." });
    }
  }

  static async readAgendamentos(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const agendamento = await Agendamentos.findOne({ where: { id: id } });

      if (!agendamento) {
        return res
          .status(404)
          .json({ message: "Nenhum agendamento foi encontrado." });
      }

      const formattedAgendamento = await this.getFormattedAgendamento(
        parseInt(id)
      );

      res.status(200).json({
        message: "Agendamento resgatado com sucesso!",
        data: formattedAgendamento,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao resgatar agendamento." });
    }
  }

  static async readAgendamentosToday(req: Request, res: Response) {
    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      const agendamentos = await Agendamentos.findAll({
        where: {
          data_agendamento: Sequelize.where(
            Sequelize.fn("DATE", Sequelize.col("data_agendamento")),
            formattedDate
          ),
        },
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(404).json({
          message: "Nenhum agendamento foi encontrado para hoje.",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos de hoje resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao resgatar os agendamentos de hoje." });
    }
  }

  static async readAgendamentosByWeek(req: Request, res: Response) {
    try {
      const currentDate = new Date();

      const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
      const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

      const agendamentos = await Agendamentos.findAll({
        where: {
          data_agendamento: {
            [Op.between]: [startOfCurrentWeek, endOfCurrentWeek],
          },
        },
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(404).json({
          message: "Nenhum agendamento foi encontrado nesta semana.",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos da semana resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao resgatar os agendamentos pelo mês." });
    }
  }

  static async readAgendamentosByMonth(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadeFilterByMonthData(
      req.body
    );

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    const monthYear = value.mes_ano;

    const [month, year] = monthYear.split("/");

    try {
      const agendamentos = await Agendamentos.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("data_agendamento")),
              month
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("data_agendamento")),
              year
            ),
          ],
        },
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(404).json({
          message: "Nenhum agendamento foi encontrado neste mês.",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos da semana resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao resgatar os agendamentos pelo mês." });
    }
  }

  static async readAgendamentosByDate(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadeFilterByDateData(
      req.body
    );

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    const dayMonthYear = value.dia_mes_ano;

    const [day, month, year] = dayMonthYear.split("/");

    try {
      const agendamentos = await Agendamentos.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("DAY", Sequelize.col("data_agendamento")),
              day
            ),
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("data_agendamento")),
              month
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("data_agendamento")),
              year
            ),
          ],
        },
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(500).json({
          message: "Nenhum agendamento foi encontrado na data informada",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos pela data resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Erro ao resgatar os agendamentos pela data informada.",
      });
    }
  }

  static async readAgendamentosByPendentes(req: Request, res: Response) {
    try {
      const agendamentos = await Agendamentos.findAll({
        where: { situacao: false },
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(500).json({
          message: "Nenhum agendamento pendente foi encontrado",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos pendentes resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Erro ao resgatar os agendamentos pendentes.",
      });
    }
  }

  static async readAgendamentosByPagos(req: Request, res: Response) {
    try {
      const agendamentos = await Agendamentos.findAll({
        where: { situacao: true },
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(500).json({
          message: "Nenhum agendamento pago foi encontrado",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos pagos resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Erro ao resgatar os agendamentos pagos.",
      });
    }
  }

  static async readAgendamentosByClientes(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const clienteExists = await this.clienteExists(parseInt(id));

      if (!clienteExists) {
        return res
          .status(404)
          .json({ message: "Cliente informado não foi encontrado." });
      }

      const clientePets = await Pets.findAll({
        where: { id_cliente: id },
      });

      if (!clientePets || clientePets.length === 0) {
        return res.status(404).json({
          message: "Cliente informado não possui pets.",
        });
      }

      const agendamentos = await Agendamentos.findAll({
        include: [
          {
            model: Pets,
            attributes: ["nome_pet", "raca_pet"],
            where: { id_cliente: id },
          },
        ],
        attributes: ["id", "data_agendamento", "id_pet"],
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(404).json({
          message: "Nenhum agendamento foi encontrado para este cliente.",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos por cliente resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Erro ao resgatar os agendamentos por cliente.",
      });
    }
  }

  static async readAgendamentosByPets(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const petExists = await this.petExists(parseInt(id));

      if (!petExists) {
        return res
          .status(404)
          .json({ message: "Pet informado não foi encontrado." });
      }

      const agendamentos = await Agendamentos.findAll({
        where: { id_pet: id },
        attributes: ["id", "data_agendamento", "id_pet"],
      });

      if (!agendamentos || agendamentos.length === 0) {
        return res.status(404).json({
          message: "Nenhum agendamento foi encontrado para este pet.",
        });
      }

      const agendamentosFormatted = await Promise.all(
        agendamentos.map(async (agendamento) => {
          const plainAgendamento = agendamento.get({ plain: true });
          return await this.getFormattedAgendamento(plainAgendamento.id);
        })
      );

      res.status(200).json({
        message: "Agendamentos por pet resgatados com sucesso.",
        data: agendamentosFormatted,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Erro ao resgatar os agendamentos por pet.",
      });
    }
  }

  static async createAgendamentos(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadeAgendamentoData(
      req.body
    );

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    const pet = await this.petExists(value.id_pet);

    if (!pet) {
      return res
        .status(404)
        .json({ message: "Pet informado não foi foi encontrado." });
    }

    const data_agendamentoCorrectType = convertToDateType(
      value.data_agendamento
    );

    const camposOpcionais: Partial<Agendamento> = {};

    const situacao = value.situacao
      ? value.situacao.trim().toLowerCase()
      : false;

    if (situacao === "sim") {
      camposOpcionais.situacao = true;
    } else if (situacao === "nao" || situacao === "não" || situacao === "") {
      camposOpcionais.situacao = false;
    }

    if (value.desconto) {
      camposOpcionais.desconto = parseFloat(value.desconto.replace(",", "."));
    } else {
      camposOpcionais.desconto = 0;
    }
    if (value.observacao) {
      camposOpcionais.observacao = value.observacao;
    } else {
      camposOpcionais.observacao = "";
    }

    try {
      const agendamentoAlreadyUsedBySamePet = await Agendamentos.findAll({
        where: {
          data_agendamento: data_agendamentoCorrectType,
          id_pet: value.id_pet,
        },
      });

      const agendamentoAlreadyUsedByAnotherPet = await Agendamentos.findAll({
        where: {
          data_agendamento: data_agendamentoCorrectType,
          id_pet: { [Sequelize.Op.ne]: value.id_pet },
        },
      });

      if (agendamentoAlreadyUsedBySamePet.length > 0) {
        return res
          .status(404)
          .json({ message: "Este pet já foi agendado neste horário" });
      }
      if (agendamentoAlreadyUsedByAnotherPet.length > 1) {
        return res
          .status(404)
          .json({ message: "Dois pets já foram agendados neste horário" });
      }

      const newAgendamento = (await Agendamentos.create({
        data_agendamento: data_agendamentoCorrectType,
        id_pet: value.id_pet,
        ...camposOpcionais,
      })) as unknown as Agendamento;

      const formattedNewAgendamento = await this.getFormattedAgendamento(
        newAgendamento.id
      );

      res.status(200).json({
        message: "Agendamento criado com sucesso.",
        data: {
          formattedNewAgendamento,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar agendamento." });
    }
  }

  static async updateAgendamentos(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadeAgendamentoData(
      req.body,
      true
    );

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    const pet = await this.petExists(value.id_pet);

    if (!pet) {
      return res
        .status(404)
        .json({ message: "Pet informado não foi encontrado." });
    }

    const data_agendamentoCorrectType = convertToDateType(
      value.data_agendamento
    );

    const camposOpcionais: Partial<Agendamento> = {};

    const situacao = value.situacao
      ? value.situacao.trim().toLowerCase()
      : false;

    if (situacao === "sim") {
      camposOpcionais.situacao = true;
    } else if (situacao === "nao" || situacao === "não" || situacao === "") {
      camposOpcionais.situacao = false;
    }

    if (value.desconto) {
      camposOpcionais.desconto = parseFloat(value.desconto.replace(",", "."));
    } else {
      camposOpcionais.desconto = 0;
    }
    if (value.observacao) {
      camposOpcionais.observacao = value.observacao;
    } else {
      camposOpcionais.observacao = "";
    }

    const newAgendamento = {
      data_agendamento: data_agendamentoCorrectType,
      id_pet: value.id_pet,
      ...camposOpcionais,
    };

    try {
      const agendamentoExist = await Agendamentos.findOne({
        where: { id: value.id },
      });

      if (!agendamentoExist) {
        return res
          .status(404)
          .json({ message: "Agendamento informado não foi encontrado." });
      }

      const agendamentoAlreadyUsedBySamePet = await Agendamentos.findAll({
        where: {
          data_agendamento: data_agendamentoCorrectType,
          id_pet: value.id_pet,
          id: { [Sequelize.Op.ne]: value.id },
        },
      });

      const agendamentoAlreadyUsedByAnotherPet = await Agendamentos.findAll({
        where: {
          data_agendamento: data_agendamentoCorrectType,
          id_pet: { [Sequelize.Op.ne]: value.id_pet },
        },
      });

      if (agendamentoAlreadyUsedBySamePet.length > 0) {
        return res
          .status(404)
          .json({ message: "Este pet já foi agendado neste horário" });
      }
      if (agendamentoAlreadyUsedByAnotherPet.length > 1) {
        return res
          .status(404)
          .json({ message: "Dois pets já foram agendados neste horário" });
      }

      await Agendamentos.update(newAgendamento, {
        where: { id: value.id },
      });

      const formattedNewAgendamento = await this.getFormattedAgendamento(
        value.id
      );

      res.status(200).json({
        message: "Agendamento atualizado com sucesso.",
        data: { formattedNewAgendamento },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao atualizar agendamento." });
    }
  }

  static async deleteAgendamentos(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedAgendamento = await Agendamentos.findOne({
        where: { id: id },
      });

      if (!deletedAgendamento) {
        return res.status(404).json({
          message: "Agendamento informado não foi encontrado.",
        });
      }

      const deletedAgendamentoFormatted = await this.getFormattedAgendamento(
        parseInt(id)
      );

      await Agendamentos.destroy({ where: { id: id } });

      res.status(200).json({
        message: "O agendamento foi removido com sucesso.",
        data: deletedAgendamentoFormatted,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover agendamento." });
    }
  }

  static async resetModel() {
    await Agendamentos.drop();

    await Agendamentos.sync({ force: true });

    console.log(`Tabela ${Agendamentos.tableName} foi resetada com sucesso!`);
  }
}
