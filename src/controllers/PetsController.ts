import { Request, Response } from "express";
import Joi from "joi";

import Pets from "../models/Pets";
import Clientes from "../models/Clientes";

const petSchemaCreate = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  raca: Joi.string().max(150).required(),
  id_cliente: Joi.number().required(),
});
const petSchemaUpdate = Joi.object({
  id: Joi.number().required(),
  nome: Joi.string().min(3).max(100).required(),
  raca: Joi.string().max(150).required(),
  id_cliente: Joi.number().required(),
});

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLocaleLowerCase();
};

const formatToDateBR = (date: any) => {
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
};

export default class PetsController {
  static validadePetData(data: any, isUpdate: boolean = false) {
    const schema = isUpdate ? petSchemaUpdate : petSchemaCreate;

    const { error, value } = schema.validate(data);

    if (error) {
      const message = "Dados inválidos.";
      const details = error.details.map((detail) => {
        switch (detail.path[0]) {
          case "nome":
            return "Nome informado está inválido ou não existe.";
          case "raca":
            return "Raça informada está inválida ou não existe.";
          case "id_cliente":
            return "Cliente informado está inválido ou não existe.";
          default:
            return "Não é possível inserir ou atualizar outros dados além do nome, raça e cliente.";
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

  static async readAllPets(req: Request, res: Response) {
    try {
      const pets = await Pets.findAll({
        include: [
          {
            model: Clientes,
          },
        ],
      });

      if (pets.length === 0) {
        return res.status(404).json({ message: "Nenhum pet foi encontrado." });
      }

      res.status(200).json({
        message: "Pets resgatados com sucesso.",
        data: pets,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao resgatar todos os pets." });
    }
  }

  static async readPets(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const petWithCliente = await Pets.findOne({
        where: { id: id },
        include: {
          model: Clientes,
        },
      });

      if (!petWithCliente) {
        return res.status(404).json({ message: "Nenhum pet foi encontrado." });
      }

      const FormattedPetData = petWithCliente.get({ plain: true });

      res.status(200).json({
        message: "Pet e seu dono resgatados com sucesso.",
        data: FormattedPetData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao resgatar pet com o dono." });
    }
  }

  static async createPets(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadePetData(req.body);

    if (!valid) {
      return res.status(500).json({ message: message, errorMessage: details });
    }

    const cliente = await this.clienteExists(value.id_cliente);
    if (!cliente) {
      return res
        .status(404)
        .json({ message: "Cliente informado não foi foi encontrado." });
    }

    try {
      const newPet = await Pets.create({
        nome_pet: capitalizeFirstLetter(value.nome),
        raca_pet: capitalizeFirstLetter(value.raca),
        id_cliente: value.id_cliente,
      });

      const petPlain = newPet.get({ plain: true });

      const petWithCliente = await Pets.findOne({
        where: { id: petPlain.id },
        include: {
          model: Clientes,
        },
      });

      res.status(200).json({
        message: "Pet criado com sucesso.",
        data: petWithCliente,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar pet." });
    }
  }

  static async updatePets(req: Request, res: Response) {
    const { valid, value, message, details } = this.validadePetData(
      req.body,
      true
    );

    if (!valid) {
      return res.status(400).json({ message, errorMessage: details });
    }

    const newPet = {
      nome_pet: capitalizeFirstLetter(value.nome),
      raca_pet: capitalizeFirstLetter(value.raca),
      id_cliente: value.id_cliente,
    };

    try {
      const pet = await Pets.findOne({
        where: { id: value.id },
      });

      if (!pet) {
        return res
          .status(404)
          .json({ message: "Pet informado não foi encontrado." });
      }

      const cliente = await this.clienteExists(value.id_cliente);
      if (!cliente) {
        return res
          .status(404)
          .json({ message: "Cliente informado não foi encontrado." });
      }

      await Pets.update(newPet, { where: { id: value.id } });

      const petWithCliente = await Pets.findOne({
        where: { id: value.id },
        include: {
          model: Clientes,
        },
      });

      res
        .status(200)
        .json({ message: "Pet atualizado com sucesso.", data: petWithCliente });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar pet." });
    }
  }

  static async deletePets(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedPet = await Pets.findOne({ where: { id: id } });

      if (!deletedPet) {
        return res.status(404).json({
          message: "Pet informado não foi encontrado.",
        });
      }

      await Pets.destroy({ where: { id: id } });

      res.status(200).json({
        message: "O pet e seus agendamentos foram removidos com sucesso.",
        data: deletedPet,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover pet." });
    }
  }

  static async resetModel() {
    await Pets.drop();

    await Pets.sync({ force: true });

    console.log(`Tabela ${Pets.tableName} foi resetada com sucesso!`);
  }
}
