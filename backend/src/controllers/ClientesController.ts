import { Request, Response } from "express";
import { Op } from "sequelize";
import Joi from "joi";

import Clientes from "../models/Clientes.js";
import Pets from "../models/Pets.js";
import EnderecosClientes from "../models/EnderecosClientes.js";

const clienteSchemaCreate = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  telefone: Joi.string()
    .pattern(/^\d{10,11}$/)
    .required()
    .custom((value) => {
      const sanitizedValue = value.replace(/\D/g, "");
      return sanitizedValue;
    }),
});
const clienteSchemaUpdate = Joi.object({
  id: Joi.number().required(),
  nome: Joi.string().min(3).max(100).required(),
  telefone: Joi.string()
    .pattern(/^\d{10,11}$/)
    .required()
    .custom((value) => {
      const sanitizedValue = value.replace(/\D/g, "");
      return sanitizedValue;
    }),
});


const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLocaleLowerCase();
};

export default class ClientesController {
  static validateClienteData(data: any, isUpdate: boolean = false) {
    const schema = isUpdate ? clienteSchemaUpdate : clienteSchemaCreate;

    const { error, value } = schema.validate(data);
    if (error) {
      const message = "Dados inválidos.";
      const details = error.details.map((detail) => {
        switch (detail.path[0]) {
          case "nome":
            return "Nome informado está inválido ou não existe.";
          case "telefone":
            return "Telefone informado está inválido ou não existe.";
          default:
            return "Não é possível inserir ou atualizar outros dados além do nome e telefone.";
        }
      });
      return { valid: false, message, details };
    }
    return { valid: true, value };
  }

  static async readAllClientes(req: Request, res: Response) {
    try {
      const clientes = await Clientes.findAll({
        include: [
          {
            model: Pets,
          },
          {
            model: EnderecosClientes,
          },
        ],
      });

      if (!clientes || clientes.length === 0) {
        return res.status(404).json({
          message: "Nenhum cliente foi encontrado.",
        });
      }

      const clientesVerifications = clientes.map((cliente) => {
        const clientePlain = cliente.get({ plain: true });
        const pet = clientePlain.pets;

        if (!pet || pet.length === 0) {
          clientePlain.hasPet = false;
        } else {
          clientePlain.hasPet = true;
        }

        return clientePlain;
      });

      res.status(200).json({
        message: "Clientes resgatados com sucesso.",
        data: clientesVerifications,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao resgatar todos os clientes." });
    }
  }

  static async readClientes(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const cliente = await Clientes.findOne({
        where: { id: id },
        include: [
          {
            model: Pets,
          },
          {
            model: EnderecosClientes,
          },
        ],
      });

      if (!cliente) {
        return res.status(404).json({
          message: "Nenhum cliente foi encontrado.",
        });
      }

      const clientePlain = cliente.get({ plain: true });

      if (!clientePlain.pets || clientePlain.pets.length === 0) {
        clientePlain.hasPet = false;
      } else {
        clientePlain.hasPet = true;
      }

      res.status(200).json({
        message: "Cliente resgatado com sucesso.",
        data: clientePlain,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao resgatar cliente." });
    }
  }

  static async createClientes(req: Request, res: Response) {
    const { valid, value, message, details } = this.validateClienteData(
      req.body
    );

    if (!valid) {
      return res.status(400).json({ message, errorMessage: details });
    }

    try {
      const clienteWhoseTelefoneAlreadyExists = await Clientes.findOne({
        where: { telefone_cliente: value.telefone },
      });

      const clienteWhoseNomeAlreadyExists = await Clientes.findOne({
        where: { nome_cliente: value.nome },
      });

      if (clienteWhoseTelefoneAlreadyExists) {
        return res.status(409).json({
          message: "Já existe um cliente com este telefone.",
          data: clienteWhoseTelefoneAlreadyExists,
        });
      }

      if (clienteWhoseNomeAlreadyExists) {
        return res.status(409).json({
          message: "Já existe um cliente com este nome.",
          data: clienteWhoseNomeAlreadyExists,
        });
      }

      const novoCliente = await Clientes.create({
        nome_cliente: capitalizeFirstLetter(value.nome),
        telefone_cliente: parseInt(value.telefone),
      });

      res
        .status(200)
        .json({ message: "Cliente criado com sucesso.", data: novoCliente });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar cliente." });
    }
  }

  static async updateClientes(req: Request, res: Response) {
    const { valid, value, message, details } = this.validateClienteData(
      req.body,
      true
    );

    if (!valid) {
      return res.status(400).json({ message, errorMessage: details });
    }

    const newCliente = {
      nome_cliente: capitalizeFirstLetter(value.nome),
      telefone_cliente: parseInt(value.telefone),
    };

    try {
      const cliente = await Clientes.findOne({
        where: { id: value.id },
      });

      const clienteWhoseTelefoneAlreadyExists = await Clientes.findOne({
        where: { id: { [Op.ne]: value.id }, telefone_cliente: value.telefone },
      });

      const clienteWhoseNomeAlreadyExists = await Clientes.findOne({
        where: { id: { [Op.ne]: value.id }, nome_cliente: value.nome },
      });

      if (!cliente) {
        return res.status(404).json({
          message: "Cliente informado não foi encontrado.",
        });
      }

      if (clienteWhoseTelefoneAlreadyExists) {
        return res.status(409).json({
          message: "Já existe um cliente com este telefone.",
          data: clienteWhoseTelefoneAlreadyExists,
        });
      }

      if (clienteWhoseNomeAlreadyExists) {
        return res.status(409).json({
          message: "Já existe um cliente com este Nome.",
          data: clienteWhoseNomeAlreadyExists,
        });
      }

      await Clientes.update(newCliente, { where: { id: value.id } });
      res
        .status(200)
        .json({ message: "Cliente atualizado com sucesso.", data: newCliente });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
  }

  static async deleteClientes(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleteCliente = await Clientes.findOne({ where: { id: id } });

      if (!deleteCliente) {
        return res.status(404).json({
          message: "Cliente informado não foi encontrado.",
        });
      }

      await Clientes.destroy({ where: { id: id } });

      res.status(200).json({
        message:
          "O cliente, seus pets, endereços e agendamentos foram removidos com sucesso.",
        data: deleteCliente,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover cliente." });
    }
  }

  static async resetModel() {
    await Clientes.drop();

    await Clientes.sync({ force: true });

    console.log(`Tabela ${Clientes.tableName} foi resetada com sucesso!`);
  }
}
