import { Request, Response } from "express";
import { Op } from "sequelize";
import Joi from "joi";

import Pets from "../models/Pets.js";
import Clientes from "../models/Clientes.js";
import EnderecosClientes from "../models/EnderecosClientes.js";

const enderecosClientesSchemaCreate = Joi.object({
  id_cliente: Joi.number().required(),
  cep: Joi.string()
    .pattern(/^\d{5}-\d{3}$/)
    .allow(""),
  nome_cidade: Joi.string().allow(""),
  nome_bairro: Joi.string().allow(""),
  nome_rua: Joi.string().required(),
  numero_casa: Joi.string().required(),
  complemento: Joi.string().allow(""),
});

const enderecosClientesSchemaUpdate = Joi.object({
  id: Joi.number().required(),
  id_cliente: Joi.number().required(),
  cep: Joi.string()
    .pattern(/^\d{5}-\d{3}$/)
    .allow(""),
  nome_cidade: Joi.string().allow(""),
  nome_bairro: Joi.string().allow(""),
  nome_rua: Joi.string().required(),
  numero_casa: Joi.string().required(),
  complemento: Joi.string().allow(""),
});

interface EnderecoClientes {
  id: number;
  id_cliente: number;
  cep: string;
  nome_cidade: string;
  nome_bairro: string;
  nome_rua: string;
  numero_casa: string;
  complemento: string;
}

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLocaleLowerCase();
};

export default class EnderecosClientesController {
  static validadeAgendamentoServicoData(data: any, isUpdate: boolean = false) {
    const schema = isUpdate
      ? enderecosClientesSchemaUpdate
      : enderecosClientesSchemaCreate;

    const { error, value } = schema.validate(data);

    if (error) {
      const message = "Dados inválidos.";
      const details = error.details.map((detail: Joi.ValidationErrorItem) => {
        switch (detail.path[0]) {
          case "id_cliente":
            return "cliente informado está inválido ou não existe.";
          case "cep":
            return "CEP informado está inválido." + error;
          case "nome_cidade":
            return "Nome da cidade informado está inválido.";
          case "nome_bairro":
            return "Nome do bairro informado está inválido.";
          case "nome_rua":
            return "Nome da rua informado está inválido ou não existe.";
          case "numero_casa":
            return "Número da casa informado está inválido ou não existe.";
          case "complemento":
            return "Complemento da casa informado está inválido ou não existe.";
          default:
            return "Não é possível inserir ou atualizar outros dados além do id_cliente, cep, nome_cidade, nome_bairro, nome_rua, numero_casa e complemento.";
        }
      });
      return { valid: false, message, details };
    }
    return { valid: true, value };
  }

  static async clienteExists(clienteId: number) {
    const cliente = await Clientes.findOne({
      where: { id: clienteId },
    });

    if (cliente) return true;
    return false;
  }

  static async readAllEnderecosClientes(req: Request, res: Response) {
    try {
      const enderecos = await EnderecosClientes.findAll();

      if (!enderecos || enderecos.length === 0) {
        return res
          .status(500)
          .json({ message: "Nenhum endereço foi encontrado." });
      }

      res.status(200).json({
        message: "Endereços resgatados com sucesso.",
        data: enderecos,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao resgatar todos os endereços." });
    }
  }

  static async readEnderecosClientes(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const endereco = await EnderecosClientes.findOne({ where: { id: id } });

      if (!endereco) {
        return res
          .status(500)
          .json({ message: "Nenhum endereço foi encontrado." });
      }

      res.status(200).json({
        message: "Endereço resgatado com sucesso.",
        data: endereco,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao resgatar o endereço." });
    }
  }

  static async createEnderecosClientes(req: Request, res: Response) {
    const { valid, value, message, details } =
      this.validadeAgendamentoServicoData(req.body);

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    try {
      const cliente = await this.clienteExists(value.id_cliente);

      if (!cliente) {
        return res
          .status(500)
          .json({ message: "Cliente informado não foi encontrado." });
      }

      const camposOpcionais: Partial<EnderecoClientes> = {};

      if (value.cep) {
        camposOpcionais.cep = value.cep;
      } else {
        camposOpcionais.cep = "";
      }
      if (value.nome_cidade) {
        camposOpcionais.nome_cidade = capitalizeFirstLetter(value.nome_cidade);
      } else {
        camposOpcionais.nome_cidade = "";
      }
      if (value.nome_bairro) {
        camposOpcionais.nome_bairro = capitalizeFirstLetter(value.nome_bairro);
      } else {
        camposOpcionais.nome_bairro = "";
      }
      if (value.complemento) {
        camposOpcionais.complemento = capitalizeFirstLetter(value.complemento);
      } else {
        camposOpcionais.complemento = "";
      }

      const newEnderecoCliente = (await EnderecosClientes.create({
        id_cliente: value.id_cliente,
        cep: camposOpcionais.cep,
        nome_cidade: camposOpcionais.nome_cidade,
        nome_bairro: camposOpcionais.nome_bairro,
        nome_rua: capitalizeFirstLetter(value.nome_rua),
        numero_casa: value.numero_casa,
        complemento: camposOpcionais.complemento,
      })) as unknown as EnderecoClientes;

      const newEnderecoClienteWithCliente = await EnderecosClientes.findOne({
        where: { id: newEnderecoCliente.id },
        include: [
          {
            model: Clientes,
          },
        ],
      });

      res.status(200).json({
        message: "Endereço de cliente criado com sucesso.",
        data: newEnderecoClienteWithCliente,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar endereço de cliente." });
    }
  }

  static async updateEnderecosClientes(req: Request, res: Response) {
    const { valid, value, message, details } =
      this.validadeAgendamentoServicoData(req.body, true);

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    try {
      const enderecoExists = await EnderecosClientes.findOne({
        where: { id: value.id },
      });

      if (!enderecoExists) {
        return res
          .status(500)
          .json({ message: "Endereço informado ainda não foi cadastrado." });
      }

      const cliente = await this.clienteExists(value.id_cliente);

      if (!cliente) {
        return res
          .status(500)
          .json({ message: "Cliente informado não foi encontrado." });
      }

      const camposOpcionais: Partial<EnderecoClientes> = {};

      if (value.cep) {
        camposOpcionais.cep = value.cep;
      } else {
        camposOpcionais.cep = "";
      }
      if (value.nome_cidade) {
        camposOpcionais.nome_cidade = capitalizeFirstLetter(value.nome_cidade);
      } else {
        camposOpcionais.nome_cidade = "";
      }
      if (value.nome_bairro) {
        camposOpcionais.nome_bairro = capitalizeFirstLetter(value.nome_bairro);
      } else {
        camposOpcionais.nome_bairro = "";
      }
      if (value.complemento) {
        camposOpcionais.complemento = capitalizeFirstLetter(value.complemento);
      } else {
        camposOpcionais.complemento = "";
      }

      const newEnderecoClienteData = {
        id: value.id,
        id_cliente: value.id_cliente,
        cep: camposOpcionais.cep,
        nome_cidade: camposOpcionais.nome_cidade,
        nome_bairro: camposOpcionais.nome_bairro,
        nome_rua: capitalizeFirstLetter(value.nome_rua),
        numero_casa: value.numero_casa,
        complemento: camposOpcionais.complemento,
      };

      (await EnderecosClientes.update(newEnderecoClienteData, {
        where: { id: value.id },
      })) as unknown as EnderecoClientes;

      const EnderecoClienteWithCliente = await EnderecosClientes.findOne({
        where: { id: value.id },
        include: [
          {
            model: Clientes,
          },
        ],
      });

      res.status(200).json({
        message: "Endereço de cliente atualizado com sucesso.",
        data: EnderecoClienteWithCliente,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao atualizar endereço de cliente." });
    }
  }

  static async deleteEnderecosClientes(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedEndereco = await EnderecosClientes.findOne({
        where: { id: id },
      });

      if (!deletedEndereco) {
        return res
          .status(500)
          .json({ message: "Endereço informado ainda não foi cadastrado." });
      }
      await EnderecosClientes.destroy({ where: { id: id } });

      res.status(200).json({
        message: "Endereço de cliente removido com sucesso.",
        data: deletedEndereco,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover endereço de cliente." });
    }
  }
}
