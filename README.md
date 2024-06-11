# Computação Gráfica - Trabalho B

## Descrição

Este repositório contém a resolução do Trabalho B para a disciplina de Computação Gráfica do ano letivo 2023/2024. O objetivo deste trabalho é desenvolver uma aplicação gráfica interativa utilizando Three.js, focando-se nos seguintes aspectos:

1. **Cenas e Câmaras**:
    - Configuração de uma cena com fundo de cor clara.
    - Implementação de três câmaras fixas com projeção ortogonal (vistas frontal, lateral e de topo).
    - Adição de duas câmaras fixas adicionais (uma com projeção ortogonal e outra com projeção perspectiva).
    - Inclusão de uma câmara móvel com projeção perspectiva posicionada no gancho da grua.

2. **Modelagem Geométrica**:
    - Modelagem de uma grua simplificada baseada em primitivas geométricas de Three.js, com uma hierarquia de transformações para permitir movimentos articulados.
    - Modelagem de um contentor aberto e várias cargas espalhadas pela cena.

3. **Animações e Interatividade**:
    - Controle da grua para içar e posicionar cargas dentro do contentor usando teclas específicas.
    - Alternância entre modos de exibição de arames e sólidos.
    - Implementação de detecção de colisões entre a garra da grua e as cargas, ativando animações de movimento.

4. **Heads-Up Display (HUD)**:
    - Inclusão de um HUD com o mapa das teclas para controle da grua.

## Objetivos

- Compreender e implementar a arquitetura de uma aplicação gráfica interativa.
- Explorar conceitos de modelagem geométrica por instanciação de primitivas.
- Entender o uso de câmaras virtuais e as diferenças entre projeções ortogonais e perspectivas.
- Aplicar técnicas básicas de animação.
- Implementar técnicas simples de detecção de colisões.

## Instruções de Uso

1. Clone o repositório.
2. Instale as dependências necessárias (Three.js).
3. Execute a aplicação em um servidor local.
4. Utilize as teclas definidas para operar a grua e interagir com a cena.

## Notas

- A implementação é feita utilizando a biblioteca Three.js sem o uso de bibliotecas externas para detecção de colisões ou física de movimentos.
- O código segue boas práticas de programação orientada a objetos para facilitar a reutilização e escalabilidade.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](https://github.com/fabiogvdneto/ist-cgra-2024/blob/main/LICENSE) para detalhes.

---

Para mais informações, pode consultar o enunciado completo desta entrega aqui: [Enunciado Trabalho B](https://github.com/fabiogvdneto/ist-cgra-2024/blob/main/statement-B.pdf)
