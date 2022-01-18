'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
      select OrderId as 'Order Id', convert(sum(UnitPrice*Quantity), unsigned) as 'Order Total Price', round(((1 - round((sum((UnitPrice - Discount) * Quantity)/sum(UnitPrice*Quantity)), 5)) * 100), 3) as 'Total Order Discount, %'
      from orderdetails group by OrderId order by OrderId desc
    `);

    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
      select CustomerId, CompanyName
      from customers
      where Fax is NULL && Country = 'USA'
    `);

    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        select CustomerId as 'Customer Id', count(*) as 'Total number of Orders', format(((count(*) / (select count(*) from orders)) * 100), 5) as '% of all orders'
        from orders group by CustomerID
        order by count(*) / (select count(*) from orders) desc, CustomerId
    `);

    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        select ProductId, ProductName, QuantityPerUnit
        from products
        where ProductName like 'A%' || ProductName like 'B%' || ProductName like 'C%' || ProductName like 'D%' || ProductName like 'E%' || ProductName like 'F%'
        order by ProductName
    `);

    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
	let result = await db.query(`
		select ProductName, categories.CategoryName, suppliers.CompanyName as 'SupplierCompanyName'
		from products
			join categories on products.CategoryID = categories.CategoryID
			join suppliers on products.SupplierID = suppliers.SupplierID
		order by ProductName, suppliers.CompanyName
`);

	return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
  let result = await db.query(`
		select e.EmployeeId, concat(e.FirstName, ' ', e.LastName) as 'FullName', ifnull(concat(m.FirstName, ' ', m.LastName), '-') as 'ReportsTo'
		from employees e
		left join employees m on m.EmployeeID = e.ReportsTo
		order by e.EmployeeID
`);

	return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
  let result = await db.query(`
		select categories.CategoryName, count(*) as 'TotalNumberOfProducts'
		from products
		join categories on categories.CategoryID = products.CategoryID
		group by products.CategoryID
		order by categories.CategoryName
`);

	return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
  let result = await db.query(`
		select CustomerID, ContactName
		from customers
		where ContactName like 'F__n%'
`);

	return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
	let result = await db.query(`
		select ProductId as 'ProductID', ProductName
		from products
		where Discontinued = 1
	`);

	return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
  let result = await db.query(`
		select ProductName, UnitPrice
		from products
		where UnitPrice >= 5 && UnitPrice <= 15
		order by UnitPrice, ProductName
	`);

	return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
  let result = await db.query(`
		select * from
		(
			select ProductName, UnitPrice
			from products
			order by UnitPrice desc, ProductName
			limit 20
		) as temp
		order by UnitPrice
	`);

	return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
  let result = await db.query(`
		select count(*) as 'TotalOfCurrentProducts', sum(Discontinued) as 'TotalOfDiscontinuedProducts'
		from products
	`);

	return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
	let result = await db.query(`
		select ProductName, UnitsOnOrder, UnitsInStock
		from products
		where UnitsOnOrder > UnitsInStock
	`);

return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
  let result = await db.query(`
		select
		sum(case when date(OrderDate) >= '1997-01-01' && date(OrderDate) < '1997-02-01' then 1 else 0 end) as 'January',
			sum(case when date(OrderDate) >= '1997-02-01' && date(OrderDate) < '1997-03-01' then 1 else 0 end) as 'February',
			sum(case when date(OrderDate) >= '1997-03-01' && date(OrderDate) < '1997-04-01' then 1 else 0 end) as 'March',
			sum(case when date(OrderDate) >= '1997-04-01' && date(OrderDate) < '1997-05-01' then 1 else 0 end) as 'April',
			sum(case when date(OrderDate) >= '1997-05-01' && date(OrderDate) < '1997-06-01' then 1 else 0 end) as 'May',
			sum(case when date(OrderDate) >= '1997-06-01' && date(OrderDate) < '1997-07-01' then 1 else 0 end) as 'June',
			sum(case when date(OrderDate) >= '1997-07-01' && date(OrderDate) < '1997-08-01' then 1 else 0 end) as 'July',
			sum(case when date(OrderDate) >= '1997-08-01' && date(OrderDate) < '1997-09-01' then 1 else 0 end) as 'August',
			sum(case when date(OrderDate) >= '1997-09-01' && date(OrderDate) < '1997-10-01' then 1 else 0 end) as 'September',
			sum(case when date(OrderDate) >= '1997-10-01' && date(OrderDate) < '1997-11-01' then 1 else 0 end) as 'October',
			sum(case when date(OrderDate) >= '1997-11-01' && date(OrderDate) < '1997-12-01' then 1 else 0 end) as 'November',
			sum(case when date(OrderDate) >= '1997-12-01' && date(OrderDate) <= '1997-12-31' then 1 else 0 end) as 'December'
		from orders
		`);

	return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
	let result = await db.query(`
		select OrderID, CustomerID, ShipCountry
		from orders
		where ShipPostalCode is not null
	`);

	return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
  let result = await db.query(`
		select categories.CategoryName as 'CategoryName', avg(UnitPrice) as 'AvgPrice'
		from products
		join categories on products.CategoryID = categories.CategoryID
		group by products.CategoryID
		order by avg(UnitPrice) desc, categories.CategoryName
	`);

	return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
  let result = await db.query(`
		select date_format(OrderDate, '%Y-%m-%d %T') as OrderDate, count(*) as 'Total Number of Orders'
		from orders
		where OrderDate > '1997-12-31' && OrderDate < '1999-01-01'
		group by OrderDate
		order by OrderDate
	`);

	return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
	let result = await db.query(`
		select orders.CustomerID, customers.CompanyName as 'CompanyName', sum(orderdetails.Quantity*orderdetails.UnitPrice) as 'TotalOrdersAmount, $'
		from orders
		join orderdetails on orderdetails.OrderID = orders.OrderID
		join customers on customers.CustomerID = orders.CustomerID
		group by CustomerID
		having sum(orderdetails.Quantity*orderdetails.UnitPrice) >= 10000
		order by sum(orderdetails.Quantity*orderdetails.UnitPrice) desc, CustomerID
	`);

	return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
	let result = await db.query(`
		select employees.EmployeeID as 'EmployeeID', concat(employees.FirstName, ' ', employees.LastName) as 'Employee Full Name', sum(orderdetails.Quantity*orderdetails.UnitPrice) as 'Amount, $'
		from orders
		join orderdetails on orderdetails.OrderID = orders.OrderID
		join employees on employees.EmployeeID = orders.EmployeeID
		group by EmployeeID
		order by sum(orderdetails.Quantity*orderdetails.UnitPrice) desc
		limit 1
	`);

return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
	let result = await db.query(`
		select orders.OrderID, sum(orderdetails.Quantity*orderdetails.UnitPrice) as 'Maximum Purchase Amount, $'
		from orderdetails
		join orders on orderdetails.OrderID = orders.OrderID
		group by OrderID
		order by sum(orderdetails.Quantity*orderdetails.UnitPrice) desc
		limit 1
	`);

return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
	let result = await db.query(`
		select CompanyName, 
		(select products.ProductName from products 
		join orderdetails on orderdetails.ProductID = products.ProductID
		where orderdetails.UnitPrice = max(o2.UnitPrice) && orderdetails.ProductID = products.ProductID
		limit 1) as ProductName,
		max(o2.UnitPrice) as 'PricePerItem'
		from orders o1
		join orderdetails o2 on o2.OrderID = o1.OrderID
		join customers c on c.CustomerID = o1.CustomerID
		group by CompanyName
		order by max(o2.UnitPrice) desc, CompanyName, ProductName
	`);

return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
