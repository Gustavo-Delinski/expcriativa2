import express from 'express';
import { Avaliacao, Oferta, Usuario } from '../db/tabelaDB.js';

const rota_Avaliacao = express.Router();

// Criar uma nova avaliação
rota_Avaliacao.post('/api/avaliacoes', async (req, res) => {
    const { nota, comentario, id_oferta, id_usuario } = req.body;
    try {
        const novaAvaliacao = await Avaliacao.create({
            Nota: nota,
            Comentario: comentario,
            Data: new Date(),
            ID_oferta: id_oferta,
            ID_usuario: id_usuario,
        });
        res.status(201).json(novaAvaliacao);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar avaliação', detalhes: error.message });
    }
});

// Listar todas as avaliações de uma oferta
rota_Avaliacao.get('/api/avaliacoes/:id_oferta', async (req, res) => {
    const { id_oferta } = req.params;
    try {
        const avaliacoes = await Avaliacao.findAll({
            where: { ID_oferta: id_oferta },
            include: [
                {
                    model: Usuario,
                    attributes: ['ID_usuario', 'Nome']
                }
            ]
        });
        res.json(avaliacoes);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar avaliações', detalhes: error.message });
    }
});

// Deletar uma avaliação
rota_Avaliacao.delete('/api/avaliacoes/:id_avaliacao', async (req, res) => {
    const { id_avaliacao } = req.params;
    try {
        const deletado = await Avaliacao.destroy({ where: { ID_avaliacao: id_avaliacao } });
        if (deletado) {
            res.json({ mensagem: 'Avaliação deletada com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Avaliação não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar avaliação', detalhes: error.message });
    }
});

export default rota_Avaliacao;
