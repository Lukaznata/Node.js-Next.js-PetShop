import { Request, Response } from "express";
import { Op } from "sequelize";
import Joi from "joi";

import Servicos from "../models/Servicos.js";

const servicoSchemaCreate = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  valor: Joi.string()
    .pattern(/^\d{1,4}$/)
    .required(),
});

const servicoSchemaUpdate = Joi.object({
  id: Joi.number().required(),
  nome: Joi.string().min(3).max(100).required(),
  valor: Joi.string()
    .pattern(/^\d{1,4}$/)
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

interface Servico {
  id: number;
  nome_servico: string;
  valor_servico: number;
  createdAt: Date;
  updatedAt: Date;
}

export default class ServicosController {
  static validadeServicoData(data: any, isUpdate: boolean = false) {
    const schema = isUpdate ? servicoSchemaUpdate : servicoSchemaCreate;

    const { error, value } = schema.validate(data);

    if (error) {
      const message = "Dados inválidos.";
      const details = error.details.map((detail: Joi.ValidationErrorItem) => {
        switch (detail.path[0]) {
          case "nome":
            return "Nome informado está inválido ou não existe.";
          case "valor":
            return "Valor informado está inválido ou não existe.";
          default:
            return "Não é possível inserir ou atualizar outros dados além do nome e preço.";
        }
      });
      return { valid: false, message, details };
    }
    return { valid: true, value };
  }

  static async readAllServicos(req: Request, res: Response) {
    try {
      const servicos = await Servicos.findAll({ raw: true });

      if (servicos.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum serviço foi encontrado." });
      }

      const formattedServicos: Servico[] = servicos.map((servico: any) => {
        return {
          ...servico,
          valor_servico: formatPrice(servico.valor_servico),
        };
      });

      res.status(200).json({
        message: "Serviços resgatados com sucesso!",
        data: formattedServicos,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao resgatar todos os serviços." });
    }
  }

  static async readServicos(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const servico = (await Servicos.findOne({
        where: { id: id },
      })) as unknown as Servico;

      if (!servico) {
        return res
          .status(404)
          .json({ message: "Nenhum serviço foi encontrado." });
      }

      res.status(200).json({
        message: "Serviço resgatado com sucesso!",
        data: {
          id: servico.id,
          nome_servico: servico.nome_servico,
          valor_servico: formatPrice(servico.valor_servico),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao resgatar serviço." });
    }
  }

  static async createServicos(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadeServicoData(
      req.body
    );

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    const priceCorrectFormat = parseFloat(value.valor.replace(",", "."));

    try {
      const servico = await this.servicoAlreadyExists(0, value.nome);

      if (servico[0]) {
        return res
          .status(404)
          .json({ message: "Este serviço já existe.", data: servico[1] });
      }

      const newServico = (await Servicos.create({
        nome_servico: value.nome,
        valor_servico: priceCorrectFormat,
      })) as unknown as Servico;

      res.status(200).json({
        message: "Serviço criado com sucesso.",
        data: {
          id: newServico.id,
          nome_servico: newServico.nome_servico,
          valor_servico: formatPrice(newServico.valor_servico),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar serviço." });
    }
  }

  static async updateServicos(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadeServicoData(
      req.body,
      true
    );

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    const priceCorrectFormat = parseFloat(value.valor.replace(",", "."));

    try {
      const servicoByID = await Servicos.findOne({ where: { id: value.id } });

      if (!servicoByID) {
        return res.status(500).json({
          message: "Nenhum serviço foi encontrado com este identificador.",
        });
      }

      const servico = await this.servicoAlreadyExists(value.id, value.nome);

      if (servico[0]) {
        return res
          .status(409)
          .json({ message: "Este serviço já existe.", data: servico[1] });
      }

      const newServico = {
        id: value.id,
        nome_servico: value.nome,
        valor_servico: priceCorrectFormat,
      };

      (await Servicos.update(newServico, {
        where: { id: value.id },
      })) as unknown as Servico;

      res.status(200).json({
        message: "Serviço atualizado com sucesso.",
        data: {
          id: newServico.id,
          nome_servico: newServico.nome_servico,
          valor_servico: formatPrice(newServico.valor_servico),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao atualizar serviço." });
    }
  }

  static async deleteServicos(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedServico = await Servicos.findOne({
        where: { id: id },
      });

      if (!deletedServico) {
        return res.status(404).json({
          message: "Serviço informado não foi encontrado.",
        });
      }

      const deletedServicoPlain = deletedServico.get({ plain: true });

      deletedServicoPlain.valor_servico = formatPrice(
        deletedServicoPlain.valor_servico
      );

      await Servicos.destroy({ where: { id: id } });

      res.status(200).json({
        message: "Serviço removido com sucesso.",
        data: deletedServicoPlain,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover Serviço." });
    }
  }

  static async servicoAlreadyExists(servicoId: number, servicoNome: string) {
    const servico = (await Servicos.findOne({
      where: { id: { [Op.ne]: servicoId }, nome_servico: servicoNome },
    })) as unknown as Servico;

    if (servico)
      return [
        true,
        {
          id: servico.id,
          nome_servico: servico.nome_servico,
          valor_servico: formatPrice(servico.valor_servico),
          createdAt: formatToDateBR(servico.createdAt),
          updatedAt: formatToDateBR(servico.updatedAt),
        },
      ];
    return [false];
  }

  static async resetModel() {
    await Servicos.drop();

    await Servicos.sync({ force: true });

    console.log(`Tabela ${Servicos.tableName} foi resetada com sucesso!`);
  }
}
