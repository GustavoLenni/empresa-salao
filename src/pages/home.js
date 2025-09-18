import React, { useState } from 'react';
import '../styles/home.css';
import Images from '../assets/images';

const Home = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  const [productForm, setProductForm] = useState({
    name: '',
    value: '',
    quantity: ''
  });
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    value: ''
  });

  // Estados para os históricos
  const [salesHistory, setSalesHistory] = useState([
    { id: 1, name: 'Corte feminino', value: 45.00, quantity: 1, date: '2024-01-15', total: 45.00 },
    { id: 2, name: 'Escova progressiva', value: 120.00, quantity: 1, date: '2024-01-14', total: 120.00 },
    { id: 3, name: 'Manicure', value: 25.00, quantity: 2, date: '2024-01-14', total: 50.00 }
  ]);
  
  const [expensesHistory, setExpensesHistory] = useState([
    { id: 1, description: 'Produtos para cabelo', value: 180.50, date: '2024-01-13' },
    { id: 2, description: 'Energia elétrica', value: 95.80, date: '2024-01-12' },
    { id: 3, description: 'Material de limpeza', value: 45.30, date: '2024-01-10' }
  ]);

  // Calcular estatísticas dinamicamente
  const totalSales = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expensesHistory.reduce((sum, expense) => sum + expense.value, 0);
  const stats = {
    totalSales,
    totalExpenses,
    profit: totalSales - totalExpenses,
    transactionsCount: salesHistory.length + expensesHistory.length
  };

  // Função para mostrar alerta
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Função para deletar venda
  const deleteSale = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      setSalesHistory(prev => prev.filter(sale => sale.id !== id));
      showAlert('Venda excluída com sucesso!', 'success');
    }
  };

  // Função para deletar gasto
  const deleteExpense = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este gasto?')) {
      setExpensesHistory(prev => prev.filter(expense => expense.id !== id));
      showAlert('Gasto excluído com sucesso!', 'success');
    }
  };

  // Função para editar venda
  const editSale = (sale) => {
    setEditingItem(sale);
    setProductForm({
      name: sale.name,
      value: sale.value.toString(),
      quantity: sale.quantity.toString()
    });
    setShowEditProductModal(true);
  };

  // Função para editar gasto
  const editExpense = (expense) => {
    setEditingItem(expense);
    setExpenseForm({
      description: expense.description,
      value: expense.value.toString()
    });
    setShowEditExpenseModal(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Editando venda existente
      const updatedSale = {
        ...editingItem,
        name: productForm.name,
        value: parseFloat(productForm.value),
        quantity: parseInt(productForm.quantity),
        total: parseFloat(productForm.value) * parseInt(productForm.quantity)
      };
      
      setSalesHistory(prev => 
        prev.map(sale => sale.id === editingItem.id ? updatedSale : sale)
      );
      showAlert('Venda atualizada com sucesso!', 'success');
      setShowEditProductModal(false);
    } else {
      // Adicionando nova venda
      const newSale = {
        id: Date.now(),
        name: productForm.name,
        value: parseFloat(productForm.value),
        quantity: parseInt(productForm.quantity),
        date: new Date().toISOString().split('T')[0],
        total: parseFloat(productForm.value) * parseInt(productForm.quantity)
      };
      
      setSalesHistory(prev => [newSale, ...prev]);
      showAlert('Venda adicionada com sucesso!', 'success');
      setShowProductModal(false);
    }
    
    setProductForm({ name: '', value: '', quantity: '' });
    setEditingItem(null);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Editando gasto existente
      const updatedExpense = {
        ...editingItem,
        description: expenseForm.description,
        value: parseFloat(expenseForm.value)
      };
      
      setExpensesHistory(prev => 
        prev.map(expense => expense.id === editingItem.id ? updatedExpense : expense)
      );
      showAlert('Gasto atualizado com sucesso!', 'success');
      setShowEditExpenseModal(false);
    } else {
      // Adicionando novo gasto
      const newExpense = {
        id: Date.now(),
        description: expenseForm.description,
        value: parseFloat(expenseForm.value),
        date: new Date().toISOString().split('T')[0]
      };
      
      setExpensesHistory(prev => [newExpense, ...prev]);
      showAlert('Gasto registrado com sucesso!', 'success');
      setShowExpenseModal(false);
    }
    
    setExpenseForm({ description: '', value: '' });
    setEditingItem(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Componente de Alerta
  const AlertComponent = () => {
    if (!alert.show) return null;
    
    return (
      <div className={`dashboard-alert ${alert.type}`}>
        <div className="dashboard-alert-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {alert.type === 'success' ? (
              <path d="M20 6L9 17l-5-5"/>
            ) : (
              <circle cx="12" cy="12" r="10"/>
            )}
          </svg>
          <span>{alert.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <AlertComponent />
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo-section">
            <img 
              src={Images.Logo} 
              alt="Salão da Clau" 
              className="dashboard-header-logo"
            />
            <div>
              <h1>Salão da Clau</h1>
              <p>Gestão Financeira</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Estatísticas */}
        <section className="dashboard-stats-section">
          <h2 className="dashboard-section-title">Resumo do Mês</h2>
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card primary">
              <div className="dashboard-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="l7 18-7-7h6"></path>
                  <path d="l7 6 7 7h-6"></path>
                </svg>
              </div>
              <div className="dashboard-stat-content">
                <h3>Vendas Totais</h3>
                <p className="dashboard-stat-value">{formatCurrency(stats.totalSales)}</p>
              </div>
            </div>

            <div className="dashboard-stat-card secondary">
              <div className="dashboard-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="l7 6-7 7h6"></path>
                  <path d="l7 18 7-7h-6"></path>
                </svg>
              </div>
              <div className="dashboard-stat-content">
                <h3>Gastos</h3>
                <p className="dashboard-stat-value">{formatCurrency(stats.totalExpenses)}</p>
              </div>
            </div>

            <div className="dashboard-stat-card success">
              <div className="dashboard-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20m8-9H4"></path>
                </svg>
              </div>
              <div className="dashboard-stat-content">
                <h3>Lucro Líquido</h3>
                <p className="dashboard-stat-value">{formatCurrency(stats.profit)}</p>
              </div>
            </div>

            <div className="dashboard-stat-card info">
              <div className="dashboard-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
              <div className="dashboard-stat-content">
                <h3>Transações</h3>
                <p className="dashboard-stat-value">{stats.transactionsCount}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ações Rápidas */}
        <section className="dashboard-actions-section">
          <h2 className="dashboard-section-title">Ações Rápidas</h2>
          <div className="dashboard-actions-grid">
            <button 
              className="dashboard-action-button primary"
              onClick={() => setShowProductModal(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Adicionar Venda</span>
            </button>

            <button 
              className="dashboard-action-button secondary"
              onClick={() => setShowExpenseModal(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Registrar Gasto</span>
            </button>
          </div>
        </section>

        {/* Histórico de Vendas */}
        <section className="dashboard-history-section">
          <h2 className="dashboard-section-title">Histórico de Vendas</h2>
          <div className="dashboard-history-card">
            {salesHistory.length > 0 ? (
              <div className="dashboard-history-list">
                {salesHistory.map((sale) => (
                  <div key={sale.id} className="dashboard-history-item">
                    <div className="dashboard-history-icon primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="l7 18-7-7h6"></path>
                        <path d="l7 6 7 7h-6"></path>
                      </svg>
                    </div>
                    <div className="dashboard-history-content">
                      <div className="dashboard-history-main">
                        <h4>{sale.name}</h4>
                        <span className="dashboard-history-amount positive">
                          {formatCurrency(sale.total)}
                        </span>
                      </div>
                      <div className="dashboard-history-details">
                        <span>{sale.quantity}x {formatCurrency(sale.value)}</span>
                        <span>{new Date(sale.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="dashboard-history-actions">
                      <button 
                        className="dashboard-action-btn edit"
                        onClick={() => editSale(sale)}
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        className="dashboard-action-btn delete"
                        onClick={() => deleteSale(sale.id)}
                        title="Excluir"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <p>Nenhuma venda registrada ainda</p>
              </div>
            )}
          </div>
        </section>

        {/* Histórico de Gastos */}
        <section className="dashboard-history-section">
          <h2 className="dashboard-section-title">Histórico de Gastos</h2>
          <div className="dashboard-history-card">
            {expensesHistory.length > 0 ? (
              <div className="dashboard-history-list">
                {expensesHistory.map((expense) => (
                  <div key={expense.id} className="dashboard-history-item">
                    <div className="dashboard-history-icon secondary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="l7 6-7 7h6"></path>
                        <path d="l7 18 7-7h-6"></path>
                      </svg>
                    </div>
                    <div className="dashboard-history-content">
                      <div className="dashboard-history-main">
                        <h4>{expense.description}</h4>
                        <span className="dashboard-history-amount negative">
                          -{formatCurrency(expense.value)}
                        </span>
                      </div>
                      <div className="dashboard-history-details">
                        <span>{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="dashboard-history-actions">
                      <button 
                        className="dashboard-action-btn edit"
                        onClick={() => editExpense(expense)}
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        className="dashboard-action-btn delete"
                        onClick={() => deleteExpense(expense.id)}
                        title="Excluir"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <p>Nenhum gasto registrado ainda</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal Adicionar Produto */}
      {showProductModal && (
        <div className="dashboard-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h3>Adicionar Venda</h3>
              <button 
                className="dashboard-modal-close"
                onClick={() => setShowProductModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="dashboard-modal-form">
              <div className="dashboard-input-group">
                <label htmlFor="productName">Produto/Serviço</label>
                <input
                  type="text"
                  id="productName"
                  className="dashboard-input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Nome do produto ou serviço"
                  required
                />
              </div>

              <div className="dashboard-input-row">
                <div className="dashboard-input-group">
                  <label htmlFor="productValue">Valor</label>
                  <input
                    type="number"
                    id="productValue"
                    className="dashboard-input"
                    value={productForm.value}
                    onChange={(e) => setProductForm({...productForm, value: e.target.value})}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="dashboard-input-group">
                  <label htmlFor="productQuantity">Quantidade</label>
                  <input
                    type="number"
                    id="productQuantity"
                    className="dashboard-input"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="dashboard-modal-actions">
                <button 
                  type="button" 
                  className="dashboard-button secondary"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="dashboard-button primary">
                  Adicionar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Gasto */}
      {showExpenseModal && (
        <div className="dashboard-modal-overlay" onClick={() => setShowExpenseModal(false)}>
          <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h3>Registrar Gasto</h3>
              <button 
                className="dashboard-modal-close"
                onClick={() => setShowExpenseModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="dashboard-modal-form">
              <div className="dashboard-input-group">
                <label htmlFor="expenseDescription">Descrição</label>
                <input
                  type="text"
                  id="expenseDescription"
                  className="dashboard-input"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  placeholder="Descreva o gasto"
                  required
                />
              </div>

              <div className="dashboard-input-group">
                <label htmlFor="expenseValue">Valor</label>
                <input
                  type="number"
                  id="expenseValue"
                  className="dashboard-input"
                  value={expenseForm.value}
                  onChange={(e) => setExpenseForm({...expenseForm, value: e.target.value})}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="dashboard-modal-actions">
                <button 
                  type="button" 
                  className="dashboard-button secondary"
                  onClick={() => setShowExpenseModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="dashboard-button primary">
                  Registrar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Produto */}
      {showEditProductModal && (
        <div className="dashboard-modal-overlay" onClick={() => setShowEditProductModal(false)}>
          <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h3>Editar Venda</h3>
              <button 
                className="dashboard-modal-close"
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingItem(null);
                  setProductForm({ name: '', value: '', quantity: '' });
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="dashboard-modal-form">
              <div className="dashboard-input-group">
                <label htmlFor="editProductName">Produto/Serviço</label>
                <input
                  type="text"
                  id="editProductName"
                  className="dashboard-input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Nome do produto ou serviço"
                  required
                />
              </div>

              <div className="dashboard-input-row">
                <div className="dashboard-input-group">
                  <label htmlFor="editProductValue">Valor</label>
                  <input
                    type="number"
                    id="editProductValue"
                    className="dashboard-input"
                    value={productForm.value}
                    onChange={(e) => setProductForm({...productForm, value: e.target.value})}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="dashboard-input-group">
                  <label htmlFor="editProductQuantity">Quantidade</label>
                  <input
                    type="number"
                    id="editProductQuantity"
                    className="dashboard-input"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="dashboard-modal-actions">
                <button 
                  type="button" 
                  className="dashboard-button secondary"
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditingItem(null);
                    setProductForm({ name: '', value: '', quantity: '' });
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="dashboard-button primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Gasto */}
      {showEditExpenseModal && (
        <div className="dashboard-modal-overlay" onClick={() => setShowEditExpenseModal(false)}>
          <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h3>Editar Gasto</h3>
              <button 
                className="dashboard-modal-close"
                onClick={() => {
                  setShowEditExpenseModal(false);
                  setEditingItem(null);
                  setExpenseForm({ description: '', value: '' });
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="dashboard-modal-form">
              <div className="dashboard-input-group">
                <label htmlFor="editExpenseDescription">Descrição</label>
                <input
                  type="text"
                  id="editExpenseDescription"
                  className="dashboard-input"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  placeholder="Descreva o gasto"
                  required
                />
              </div>

              <div className="dashboard-input-group">
                <label htmlFor="editExpenseValue">Valor</label>
                <input
                  type="number"
                  id="editExpenseValue"
                  className="dashboard-input"
                  value={expenseForm.value}
                  onChange={(e) => setExpenseForm({...expenseForm, value: e.target.value})}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="dashboard-modal-actions">
                <button 
                  type="button" 
                  className="dashboard-button secondary"
                  onClick={() => {
                    setShowEditExpenseModal(false);
                    setEditingItem(null);
                    setExpenseForm({ description: '', value: '' });
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="dashboard-button primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;