module.exports = {
  create: function (context) {
    return {
      ClassDeclaration(node) {
        const correctOrder = [
          "withTranslations",
          "withRouter",
          "inject",
          "observer",
        ];

        const decorators = node.decorators;

        if (!decorators) return;

        const decoratorNames = decorators.map((decorator) => {
          return decorator.expression.name;
        });

        let previousIndex = -1;

        for (let i = 0; i < decoratorNames.length; i++) {
          const name = decoratorNames[i];

          if (correctOrder.includes(name)) {
            const index = correctOrder.indexOf(name);

            if (index <= previousIndex) {
              context.report({
                node: node,
                message: `Incorrect order of decorators. Expected order: ${correctOrder.join(
                  ", "
                )}`,
              });
              break;
            }

            previousIndex = index;
          }
        }
      },
    };
  },
};
