import {Router} from "express";
import {Estabelecimento} from "../db/tabelaDB.js";
import { Servico } from "../db/tabelaDB.js";
import { Avaliacao } from "../db/tabelaDB.js";
import { Oferta } from "../db/tabelaDB.js";
import { FotosEstabelecimento } from "../db/tabelaDB.js";
// import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas imagens são permitidas.'), false);
        }
        cb(null,true);
    }
})

const rota_lojas = Router();

rota_lojas.put('/api/estabelecimentos/:id', async (req, res) => {
  const { id } = req.params;
  const { Nome, Numero, Complemento, Cnpj, CEP } = req.body;

  const loja = await Estabelecimento.findByPk(id);
  if (!loja) return res.status(404).json({ mensagem: 'Loja não encontrada.' });

  try {
    await loja.update({ Nome, Numero, Complemento, Cnpj, CEP });
    return res.json({ mensagem: 'Loja atualizada com sucesso.', updated: loja });
  } catch (error) {
    console.error('Erro no PUT /api/estabelecimentos/:id', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar loja.' });
  }
});


rota_lojas
.get('/api/estabelecimentos-completos', async (req, res) => {
  const { search, categorias, avaliacoes, precoMin, precoMax, cidade, ordem } = req.query;

  // where dos modelos
  const whereEst = {};
  const whereOferta = {};
  const whereAvali = {};

  if (search) {
    whereEst.Nome = { [Op.iLike]: `%${search}%` };
  }
  if (cidade) {
    whereEst.endereco = { [Op.iLike]: `%${cidade}%` };
  }
  if (precoMin || precoMax) {
    whereOferta.Valor = {};
    if (precoMin) whereOferta.Valor[Op.gte] = +precoMin;
    if (precoMax) whereOferta.Valor[Op.lte] = +precoMax;
  }
  if (categorias) {
    whereOferta.ID_servico = { [Op.in]: categorias.split(',').map(Number) };
  }
  if (avaliacoes) {
    whereAvali.Nota = { [Op.in]: avaliacoes.split(',').map(Number) };
  }

  // busca com includes
  const estabelecimentos = await Estabelecimento.findAll({
    where: whereEst,
    include: [{
      model: Oferta, as: 'Ofertas', where: whereOferta,
      include: [{
        model: Avaliacao, as: 'Avaliacao',
        where: Object.keys(whereAvali).length ? whereAvali : undefined,
        required: false
      }]
    }]
  });
  // ordenação in-memory
  // if (ordem) {
  //   estabelecimentos.sort((a, b) => {
  //     // mesma lógica de before…
  //     // comparação de preço ou avaliação
  //   });
  // }

  res.json(estabelecimentos);
})
.post('/api/estabelecimento/filtro', async (req, res) => {
    const { nome, nota } = req.body;

    try {
        // Filtra avaliações pela nota
        const avaliacoes = await Avaliacao.findAll({ where: { Nota: nota } });
        const ofertas = await Oferta.findAll();
        const estabelecimentos = await Estabelecimento.findAll();

        // Filtra os estabelecimentos que possuem ofertas com avaliações com a nota informada
        let encontrados = estabelecimentos.filter(estab =>
            ofertas.some(oferta =>
                oferta.ID_estabelecimento === estab.ID_estabelecimento &&
                avaliacoes.some(avaliacao =>
                    avaliacao.ID_oferta === oferta.ID_oferta &&
                    avaliacao.Nota === nota
                )
            )
        );
        // Filtro por nome
        if (encontrados.length !== 0) {
            let encontradosNome = encontrados.filter(e =>
                e.Nome.toLowerCase().includes(nome.toLowerCase())
            );

            // Lista de IDs dos estabelecimentos encontrados
            let ids = encontradosNome.map(e => e.ID_estabelecimento);

            // Buscar todos os dados com os includes
            let final = await Estabelecimento.findAll({
                where: {
                    ID_estabelecimento: ids
                },
                include: [{
                    model: Oferta,
                    as: 'Ofertas',
                    include: [{
                        model: Avaliacao,
                        as: 'Avaliacao'
                    }]
                }]
            })
            return res.status(200).json(final).end();
        }
        let encontradosNome = estabelecimentos.filter(e => e.Nome.toLowerCase().includes(nome.toLowerCase()));
        let ids = encontradosNome.map(e => e.ID_estabelecimento);
        let finalNome = await Estabelecimento.findAll({
            where: {
                ID_estabelecimento: ids
            },
            include: [{
                model: Oferta,
                as: 'Ofertas',
                include: [{
                    model: Avaliacao,
                    as: 'Avaliacao'
                }]
            }]
        })
        res.status(200).json(finalNome).end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})
// .post('/api/estabelecimento/filtro', async (req,res) => {
//   const { nome, nota } = req.body;
//
//   const estabelecimentos = await Estabelecimento.findAll();
//   const avaliacoes = await Avaliacao.findAll({ where: { Nota: nota } });
//   const ofertas = await Oferta.findAll();
//
//   console.log(req.body, avaliacoes, ofertas);
//
//   // Filtro correto
//   const encontrados = estabelecimentos.filter(estab =>
//     ofertas.some(oferta =>
//       oferta.ID_estabelecimento === estab.ID_estabelecimento &&
//       avaliacoes.some(avaliacao =>
//         avaliacao.ID_oferta === oferta.ID_oferta
//       )
//     )
//   );
//
//   const encontradosNome = encontrados.filter(e =>
//      e.Nome.toLowerCase().includes(nome.toLowerCase())
//   );
//   let final = [];
//   for (const estab of encontradosNome) {
//    final.push(await Estabelecimento.findAll({
//       where: {ID_estabelecimento: estab.ID_estabelecimento},
//       include: [{
//           model: Oferta, as: 'Ofertas',
//           include: [{
//               model: Avaliacao, as: 'Avaliacao'
//           }]
//       }]
//   }));
//     console.log(final);
//   res.status(200).json(final);
//
// }
// })
.get('/api/estabelecimento/imagem/:id', async (req, res) => {
    let ArrayFotos = [];
    const { id } = req.params;
    const fotos = await FotosEstabelecimento.findAll({
      where: { ID_estabelecimento: id }
    });
    console.log(id,fotos)
    if (fotos.length === 0) {
      return res.status(200).json('https://placehold.co/200x200');
    }
    // for (const img in fotos) {
    //     let aux = {'Contet-Type':img.TipoFoto, 'Foto':img.Foto}
    //     ArrayFotos.append(aux)
    // }
    res.set('Content-Type', fotos[0].TipoFoto || 'image/png');
    res.send(fotos[0].Foto)
})
.get('/api/estabelecimentosGay', async (req, res) => {
  try {
    // const estabelecimentos = await Estabelecimento.findAll();
    const estabelecimentos = await Estabelecimento.findAll({
      include: [
        // {
        //   model: FotosEstabelecimento,
        //   as: 'FotosEstabelecimentos',
        //   attributes: ['Foto', 'TipoFoto'],
        //   limit: 1
        // },
        {
          model: Oferta,
          as: 'Ofertas',
          include: [
            { model: Servico,as:'Servico', attributes: ['Nome'] },
            { 
              model: Avaliacao,
              as: 'Avaliacao',
              attributes: ['Nota']
            }
          ]
        }
      ]
    })
    estabelecimentos ? res.json(estabelecimentos) : res.status(400).json({erro: "não há nenhum estabelecimento registrado"});
    // ... Resto da transformação em result e res.json(result)
  } catch (err) {
    console.error("Erro no /api/estabelecimentos-completos:", err);
    res.status(500).json({ erro: "Não foi possível carregar os estabelecimentos" });
  }
})
.get('/api/estabelecimentos', async (req, res) => {
    const estabelecimentos = await Estabelecimento.findAll();
    estabelecimentos ? res.status(200).json(estabelecimentos) : res.status(404).end();
})
.get('/api/estabelecimentosNovo/:id', async (req, res) => {
    const { id } = req.params;
        try {
            const estabelecimentos = await Estabelecimento.findAll({
                where: {ID_usuario: id},order: [['ID_estabelecimento', 'DESC']]
            });
            estabelecimentos.length
                ? res.status(200).json(estabelecimentos)
                : res.status(404).end();
        } catch (error) {
            console.error('Erro ao buscar estabelecimentos:', error);
            res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    })
.post('/api/CriarEstabelecimento', async (req, res) => {
    const { Nome,Email,Telefone,Estado,Cidade,Bairro, Endereco, Numero, Complemento, CNPJ, CEP, usuarioId} = req.body;
    const lojas = await Estabelecimento.findOne({ where: { Cnpj: CNPJ } });
    // const id_usuario = 1 //req.session?.usuarioId;

    if (lojas) {
        return res.status(400).json({mensagem:"CNPJ ja cadastrado."});
    }

    console.log("Dados recebidos:", req.body); // Adicione isso para debug
    
    try {
        const newEstabele = await Estabelecimento.create({
            Nome: Nome,
            Email:Email,
            Cnpj: CNPJ,
            Logradouro: Endereco,
            Numero: Numero ? Numero : null,
            Complemento: Complemento ? Complemento : null,
            Bairro: Bairro,
            Cidade: Cidade,
            UF: Estado,
            CEP: CEP,
            Telefone: Telefone,
            ID_usuario: usuarioId
        });

        res.status(200).json({ mensagem: "Estabelecimento cadastrado com sucesso.",estabelecimento:newEstabele});
    } catch (error) {
        console.error("Erro ao cadastrar estabelecimento:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar estabelecimento: ${error}` }); // Retorne JSON
    }
})
.post('/api/CriarFotoEstabelecimento', upload.single('file'), async (req, res) => {
    const { CNPJ } = req.body;
    const lojas = await Estabelecimento.findOne({ where: { Cnpj: CNPJ } });

    try {
        await FotosEstabelecimento.create({
            Foto: req.file.buffer,
            TipoFoto: req.file.mimetype,
            ID_estabelecimento: lojas.ID_estabelecimento
        });

        res.status(200).json({ mensagem: "Foto do estabelecimento cadastrada com sucesso." });

    } catch (error) {
        console.error("Erro ao cadastrar foto do estabelecimento:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar foto do estabelecimento: ${error}` });
    }
})
.get('/api/Usuarioestabelecimentos/:id', async (req, res) => {
    const { id } = req.params;
    const loja = await Estabelecimento.findAll({where: {ID_usuario: id}});
    return loja ? res.json(loja) : res.status(404).end();
})
.get('/api/estabelecimento/:id', async (req, res) => {
    const { id } = req.params;
    const estabelecimento = await Estabelecimento.findByPk(id);
    console.log(estabelecimento)
    return estabelecimento ? res.json(estabelecimento) : res.status(404).end();
})
.get('/api/estabelecimento/foto/:id', async (req, res) => {
    const {id} = req.params;
    const fotos = await FotosEstabelecimento.findAll({where: {ID_estabelecimento: id}});

    if (!fotos || fotos.length === 0) {
        return res.status(204).send(null); // Sem conteúdo
    }

    // Transforma os ‘buffers’ em base64 para enviar via JSON
    const fotosFormatadas = fotos.map(foto => ({
        id: foto.id,
        tipo: foto.Tipo || 'image/png',
        imagemBase64: foto.Foto.toString('base64')
    }));

    res.status(200).json(fotosFormatadas);
})
.get('/api/estabelecimento/primeirafoto/:id', async (req, res) => {
    const {id} = req.params;
    const fotos = await FotosEstabelecimento.findAll({where: {ID_estabelecimento: id}});

    if (!fotos || fotos.length === 0) {
        return res.status(204).send(null); // Sem conteúdo
    }

    // Transforma os ‘buffers’ em base64 para enviar via JSON
    res.set('Content-Type', fotos[0].TipoFoto || 'image/png');
    res.send(fotos[0].Foto)
})



.put('/api/Updtestabelecimento/:id', async (req, res) => {
    const { id } = req.params;
    const { Nome, Email, Telefone, CNPJ, CEP, Estado, Cidade, Bairro,Endereco, Numero, Complemento } = req.body;

    const estabelecimento = await Estabelecimento.findByPk(id);
    console.log(req.body)
    if (!estabelecimento) {
        return res.status(404).json({ mensagem: 'Loja não encontrada.' });
    }
    
    try {
        const updated = await estabelecimento.update({
            Nome: Nome,
            Email: Email,
            Telefone: Telefone,
            Cnpj: CNPJ,
            CEP: CEP,
            UF: Estado,
            Cidade: Cidade,
            Bairro: Bairro,
            Logradouro:Endereco,
            Numero: Numero,
            Complemento: Complemento
        });
        console.log(updated)
        return res.status(200).json({ mensagem: 'Loja atualizada com sucesso.', updated });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao atualizar loja.' });
    }
})
.post('/api/UptdFotoEstabelecimento', upload.single('file'), async (req, res) => {
        const { CNPJ } = req.body;
        const lojas = await Estabelecimento.findOne({ where: { Cnpj: CNPJ } });

        try {
            await FotosEstabelecimento.create({
                Foto: req.file.buffer,
                TipoFoto: req.file.mimetype,
                ID_estabelecimento: lojas.ID_estabelecimento
            });

            res.status(200).json({ mensagem: "Foto do estabelecimento cadastrada com sucesso." });

        } catch (error) {
            console.error("Erro ao cadastrar foto do estabelecimento:", error);
            res.status(500).json({ mensagem: `Erro ao cadastrar foto do estabelecimento: ${error}` });
        }
    })
.delete('/api/estabelecimentos/:id', async (req, res) => {
  const { id } = req.params;
  const loja = await Estabelecimento.findByPk(id);
  if (!loja) return res.status(404).end();
  await loja.destroy();
  res.json({ mensagem: 'Loja deletada.' });
});

export default rota_lojas;

//export default {rota_lojas, rota_avaliacao,rota_foto,rota_oferta,rota_servico};


